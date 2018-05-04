import React, { Component } from 'react';
import logo from './logo.svg';
import incompleteIcon from './images/Incomplete.svg';
import completedIcon from './images/Completed.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup, ListGroupItem, Badge, Collapse, Card, CardHeader, CardSubtitle, CardBody, CardText, CardTitle, Row, Col} from 'reactstrap'

class TaskList extends Component {
    constructor(props) {
        super(props);
		this.tasks = props.tasks
		this.taskMap = this.initializeTaskMap(props.tasks);
		this.state = {
			taskMap: this.taskMap,
			tasks: this.tasks,
			isLocked: false,
			isIncomplete: true,
			isComplete: false
		};
    }
    
	initializeTaskMap(tasks) {
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
	
	updateTask(task, index) {
		if (task.completedAt == null)
		{
			task.completedAt = new Date().toString()
			this.taskMap[task.group].taskCompleted++;
		}
        else
		{
			task.completedAt = null;
			this.taskMap[task.group].taskCompleted--;
		}
		this.setState({
			isIncomplete: (task.completedAt == null),
			isComplete: (task.completedAt != null)
		});
	}
	renderTaskList()
	{
		var keys = Object.keys(this.taskMap);
		var buffer = [];
		for(var i = 0; i < keys.length; i++)
		{
			var key = keys[i];
			buffer.push(
				<CardBody key = {key}>
					<CardTitle>{key}</CardTitle>
					<CardText>{this.state.taskMap[key].taskCompleted} OF {this.state.taskMap[key].taskTotal} TASKS COMPLETE</CardText>
				</CardBody>
			);
			// Add task to corresponding group
			var tasks = this.taskMap[key].tasks;
			var bufferTaskList = [];
			for(var j = 0; j < tasks.length; j++)
			{
				var item = tasks[j];
				var itemKey = tasks[j].group+tasks[j].id;
				bufferTaskList.push(<ListGroupItem key={itemKey} onClick={this.updateTask.bind(this, tasks[j], j)} >{this.state.tasks[j].task}</ListGroupItem>);
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
	
	CustomListGroupItem(props) {
		if (props.state)
		{
			return (
				<li className="list-group-item" onClick={() => {}}>
					<img src={completedIcon} />{'\u00A0\u00A0\u00A0'}<strike>{props.text}</strike>
				</li>
			);
		}
		else
		{
			return (
				<li className="list-group-item" onClick={() => {}}>
					<img src={incompleteIcon} />{'\u00A0\u00A0\u00A0'}{props.text}
				</li>
			);
		}
	}
	
	renderTaskDetail()
	{
		var buffer = [];
		var bufferTaskDetail = [];

		//bufferTaskDetail.push(<this.CustomComponent state={this.state} text={"Locked Task"}/>);
		bufferTaskDetail.push(<ListGroupItem>Locked Task {this.state.isLocked}</ListGroupItem>);
		bufferTaskDetail.push(<this.CustomListGroupItem state={this.state.isIncomplete} text={"Incomplete Task"} />);
		bufferTaskDetail.push(<this.CustomListGroupItem state={this.state.isComplete} text={"Complete Task"} />);
		buffer.push(<ListGroup>{bufferTaskDetail}</ListGroup>);
		const element = (
			<Card body>
				{buffer}
			</Card>
		);
		return element;
	}
    render() {
        return (
            <div>
				<Row>
					<Col sm="6">
						<Card body>
							{this.renderTaskList()}
						</Card>
					</Col>
					<Col sm="6">
						<Card body>
							{this.renderTaskDetail()}
						</Card>
					</Col>
				</Row>
            </div>
        );
    }
}

export default TaskList;
