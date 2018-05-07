import React, { Component } from 'react';
import TaskItem from './TaskItem.js';
import incompleteIcon from './images/Incomplete.svg';
import completedIcon from './images/Completed.svg';
import lockedIcon from './images/Locked.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ListGroup, ListGroupItem, Badge, Collapse, Card, CardHeader, CardSubtitle, CardBody, CardText, CardTitle, Row, Col} from 'reactstrap'

class TaskList extends Component {
    constructor(props) {
        super(props);
		this.tasks = props.tasks
		this.taskMap =  this.initializeTaskMap(props.tasks);
		this.taskGroupMap = this.initializeTaskGroupMap(props.tasks);
		this.taskInfoElement = "";
		this.task = null;
		this.isLocked = false;
		this.state = {
			taskGroupMap: this.taskGroupMap,
			updateRender: false,
		};
    }
    
	initializeTaskMap(tasks) {
		var taskMap = new Object();
		for(var i = 0; i < tasks.length; i++)
		{
			taskMap[tasks[i].id] =  tasks[i];
		}
		return taskMap;
	}
	
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
				taskGroupInfo.tasks = new Array(tasks[i]);
				taskGroupMap[key] = taskGroupInfo;
			}
		}
		return taskGroupMap;
	}
	
	updateTask = (task, locked) =>
	{
		this.task = task;
		this.isLocked = locked;
		this.setState({
			updateRender: true,
		});
	}
	
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
	
	renderTaskList()
	{
		var keys = Object.keys(this.taskGroupMap);
		var buffer = [];
		// For each group
		for(var i = 0; i < keys.length; i++)
		{
			var key = keys[i];
			buffer.push(
				<CardBody key = {key}>
					<CardTitle>{key}</CardTitle>
					<CardText>{this.state.taskGroupMap[key].taskCompleted} OF {this.taskGroupMap[key].taskTotal} TASKS COMPLETE</CardText>
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
			buffer.push(<ListGroup>{bufferTaskList}</ListGroup>);
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
