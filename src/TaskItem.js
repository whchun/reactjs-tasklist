import React, { Component } from 'react';
import logo from './logo.svg';
import incompleteIcon from './images/Incomplete.svg';
import completedIcon from './images/Completed.svg';
import lockedIcon from './images/Locked.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ListGroupItem} from 'reactstrap'

class TaskItem extends Component {
	constructor(props) {
		super(props)
		this.task = props.task;
		this.taskMap = props.taskMap;
	}
	
	checkLock(task)
	{
		var isLocked = false;
		for(var i = 0; i < task.dependencyIds.length; i++)
		{
			var id = task.dependencyIds[i];
			if ((this.taskMap[id] != null) && (this.taskMap[id].completedAt == null))
			{
				isLocked = true;
				break;
			}
		}
		return isLocked;
	}
	
	handleClick = () => {
		const isLocked = this.checkLock(this.task);
		this.props.callback(this.task, isLocked);
	}

	render() {
		return (
			<ListGroupItem onClick={this.handleClick}>
				{this.task.task}
			</ListGroupItem>
		);
	}
}

export default TaskItem