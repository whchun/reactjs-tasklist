import React, { Component } from 'react';
import TaskItem from './TaskItem.js';
import incompleteIcon from './images/Incomplete.svg';
import completedIcon from './images/Completed.svg';
import lockedIcon from './images/Locked.svg';
import groupIcon from './images/Group.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ListGroup, Badge, Collapse, Card, CardBody, CardText, CardTitle, Row, Col} from 'reactstrap'

class TaskList extends Component {
    constructor(props) {
        super(props);
		this.tasks = props.tasks
		this.taskMap =  this.initializeTaskMap(props.tasks);
		this.taskGroupMap = this.initializeTaskGroupMap(props.tasks);
		
		this.task = null;
		this.isLocked = false;
		this.state = {
			taskGroupMap: this.taskGroupMap,
			updateRender: false,
		};
    }
    
	// Create hash table that maps task id to corresponding task
	// This is used to find dependency tasks easily.
	initializeTaskMap(tasks) {
		var taskMap = new Object();
		for(var i = 0; i < tasks.length; i++)
		{
			var taskObj = new Object();
			taskObj.task = tasks[i];
			taskObj.isActive = false;
			taskMap[tasks[i].id] = taskObj;
		}
		return taskMap;
	}
	
	// Create hash table that maps group name to list of tasks and group information.
	// [groupName] => {taskCompleted, taskTotal, isActive, [tasks]}
	initializeTaskGroupMap(tasks) {
		var taskGroupMap = new Object();
		for(var i = 0; i < tasks.length; i++)
		{
			var key = tasks[i].group;
			// Update total task count and 
			if (key in taskGroupMap)
			{
				if (tasks[i].completedAt != null)
					taskGroupMap[key].taskCompleted++;
				taskGroupMap[key].taskTotal++;
				taskGroupMap[key].tasks.push(tasks[i]);
			}
			else
			{
				var taskGroupInfo = new Object();
				taskGroupInfo.taskCompleted = 0;
				if (tasks[i].completedAt != null)
					taskGroupInfo.taskCompleted = 1;
				taskGroupInfo.taskTotal = 1;
				taskGroupInfo.isActive = false;
				taskGroupInfo.tasks = new Array(tasks[i]);
				taskGroupMap[key] = taskGroupInfo;
			}
		}
		return taskGroupMap;
	}
	
	// Handle when each task is selected
	updateTask = (task, locked) =>
	{
		this.task = task;
		this.isLocked = locked;
		var keys = Object.keys(this.taskMap);
		for(var i = 0; i < keys.length; i++)
		{
			const key = keys[i];
			this.taskMap[key].isActive = false;
		}
		this.taskMap[task.id].isActive = true;
		this.setState({
			updateRender: true,
		});
	}
	
	// Handle when marked as complete or incomplete
	updateTaskGroup = () =>
	{
		// ToDo: Fix making it incomplete for dependent ids
		const completed = (this.task.completedAt != null)
		if ((!this.isLocked) && (!completed)) {
			this.taskGroupMap[this.task.group].taskCompleted++;
			this.task.completedAt = new Date().toString();
			this.setState({
				taskGroupMap: this.taskGroupMap
			});
		}
		else if ((!this.isLocked) && (completed)) {
			this.taskGroupMap[this.task.group].taskCompleted--;
			this.task.completedAt = null;
			this.setState({
				taskGroupMap: this.taskGroupMap
			});
		}
	}
	
	// Handle collapsing the group task
	updateCollapse(key) {
		var groupMap = this.taskGroupMap;
		groupMap[key].isActive = !(groupMap[key].isActive);
		this.setState(groupMap);
	}
	
	renderTaskList()
	{
		var keys = Object.keys(this.taskGroupMap);
		var buffer = [];
		// For each group
		for(var i = 0; i < keys.length; i++)
		{
			const key = keys[i];
			buffer.push(
				<CardBody key = {key} onClick={() => this.updateCollapse(key)}>
					<CardTitle><img src={groupIcon} /> {key}</CardTitle>
					<CardText><Badge color="primary" pill>{this.state.taskGroupMap[key].taskCompleted}</Badge> OF {this.taskGroupMap[key].taskTotal} TASKS COMPLETE</CardText>
				</CardBody>
			);
			// Add task to corresponding group
			var tasks = this.taskGroupMap[key].tasks;
			var bufferTaskList = [];
			for(var j = 0; j < tasks.length; j++)
			{
				var item = tasks[j];
				var itemKey = tasks[j].group+tasks[j].id;
				bufferTaskList.push(<TaskItem key={itemKey} callback={this.updateTask} task={tasks[j]} index = {j} taskMap={this.taskMap} />);
			}
			buffer.push(<Collapse  isOpen={this.state.taskGroupMap[key].isActive}><ListGroup>{bufferTaskList}</ListGroup></Collapse>);
		}
		const element = (
				<Card body>
					{buffer}
				</Card>
		);
		
		return element;
	}
	
	renderTaskDetail()
	{
		if (this.task == null)
			return ""			

		if (this.state.updateRender){
			var icon = lockedIcon;
			var text = "Locked Task";
			
			var lockedElement = "";
			if (this.isLocked) {
				lockedElement = (
					<li className="list-group-item" onClick={this.updateTaskGroup}>
						<img src={icon} />{'\u00A0\u00A0\u00A0\u00A0\u00A0'}{text}
					</li>
				);
			}
			
			icon = completedIcon;
			text = "Complete Task";
			if (this.task.completedAt == null) {
				icon = incompleteIcon;
				text = "Incomplete Task"
			}
			var completeElement = (
				<li className="list-group-item" onClick={this.updateTaskGroup}>
					<img src={icon} />{'\u00A0\u00A0\u00A0\u00A0\u00A0'}{text}
				</li>
			);
		
			const element = (
				<Card body>
					{lockedElement}
					{completeElement}
				</Card>
			);
			return element;
		}
	}
	
    render() {
        return (
            <div>
				<Row>
					<Col sm="6">		
						{this.renderTaskList()}	
					</Col>
					<Col sm="6">						
						{this.renderTaskDetail()}
					</Col>
				</Row>
            </div>
        );
    }
}

export default TaskList;
