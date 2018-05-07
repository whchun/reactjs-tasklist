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
	
	// Check if current task has dependent tasks that has not completed.
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
	
	// Add active/selected UI based on selected task
	checkActive() {
		const isActive = this.taskMap[this.task.id].isActive;
		return isActive;
	}
	
	// Check lock and callback TaskList.js to update UI
	handleClick = () => {
		const isLocked = this.checkLock(this.task);
		this.props.callback(this.task, isLocked);
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