import React, { Component } from 'react';
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
			if ((this.taskMap[id] != null) && (this.taskMap[id].task.completedAt == null))
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

	checkActive() {
		const isActive = this.taskMap[this.task.id].isActive;
		return isActive;
	}
	
	render() {
		return (
			<ListGroupItem onClick={this.handleClick} active={this.checkActive()}>
				{this.task.task}
			</ListGroupItem>
		);
	}
}

export default TaskItem