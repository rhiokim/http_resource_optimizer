/**
 * 파일 명칭
 *
 * @name nhn.Calendar
 * @namespace
 * @author rhio.kim
 * @version 0.1
 */

var TodoView = function(bComplete){
	var me,
		sGroupId = 0,
		sTodoId,
		sSort,
		bComplete = bComplete,
		elContainer = $$.getSingle('._todo_area');

	/**
	 * 할일 Header 영역 컴포넌트
	 */
	var oHeaderView = new TodoHeaderView(elContainer);
		oHeaderView.attach({
			seemore : function(we){
				me.fireEvent('clickmore', { complete : bComplete });
			}
		});

	/**
	 * 할일 정렬 영역 컴포넌트
	 */
	var oSortView = new TodoSortView(elContainer);
		oSortView.attach({
			change : function(we){
				we.groupId = sGroupId;
				me.fireEvent('changesort', we);
			},
			checkcomplete : function(we){
				we.groupId = sGroupId;
				bComplete = we.complete;
				me.fireEvent('containendtodo', we);
			}
		});

	/**
	 * 할일 입력 영역 컴포넌트
	 */
	var oInsertView = new TodoInsertView($$.getSingle('._input_area', elContainer));
		oInsertView.attach({
			submit : function(we){
				if(we.content == nhn.Calendar.getMessage("TXT_035")) {
					we.content = nhn.Calendar.getMessage("TXT_011");
				}

				we.groupId = sGroupId;
				me.fireEvent('createtodo', we);
			}
		});

	/**
	 * 할일 목록 영역 컴포넌트
	 */
	var oListView = new TodoListView(elContainer);
		oListView.attach({
			checkcomplete : function(we){
				me.fireEvent('completetodo', { _event : we._event, element : we.element, todoId : sTodoId});
			},
			clickimpotant : function(we){
				me.fireEvent('changeimportant', { _event : we._event, element : we.element, todoId : sTodoId});
			},
			clickcontent : function(we){
				me.fireEvent('modifytodo', { _event : we._event, element : we.element, todoId : sTodoId});
			},
			mousedown : function(we){
				if(nhn.Calendar.getInstance("MainCalendarSchedule").getCalendarViewType() == "list"){
					return;
				}

				sTodoId = we.todoId;
				oDragDrop.start(we);
			}
		});

	/**
	 * 할일 그룹 선택박스 컴포넌트
	 */
	var oGroupView = new TodoGroupView(elContainer);
		oGroupView.attach({
			change : function(we){
				sGroupId = we.groupId;
				we.complete = bComplete;
				me.fireEvent('changegroup', we);
			}
		});

	/**
	 * 할일 드래그 드랍 컴포넌트
	 */
	var oDragDrop = new TodoDragDrop(elContainer);
		oDragDrop.attach({
			drop : function(we){
				me.fireEvent('droppedschedule', { event : we, todoId : sTodoId });
			},
			click : function(we){
				oListView.click(we);
			}
		});

	/**
	 * 외부에서 할일로 드래그 드랍 컴포넌트
	 */
	var oOutterDragDrop = new TodoDragDropSchedule();
		oOutterDragDrop.attach({
			dropped : function(we){
				me.fireEvent('droppedtodo', we);
			}
		});

	/**
	 * @desc 외부에서 드래그 드랍으로 할일 영역으로 mousemove 이벤트 핸들러
	 * @param we
	 */
	function _mousemoveFromSchedule(we){
		oOutterDragDrop.onMouseMove(we);
	}

	/**
	 * @desc 외부에서 드래그 드랍으로 할일 영역으로 mouseup 이벤트 핸들러
	 * @param we
	 */
	function _mousemoupFromSchedule(we){
		oOutterDragDrop.onMouseUp(we);
	}

	return me = new ($Class({
		$init : function(){
			oSortView.setContainEndTodo(bComplete);

			// 일정 이동을 위한 이벤트를 attach처리 한다.
			nhn.Calendar.getInstance("MainCalendarSchedule").attach("mousemove_schedule_outer", _mousemoveFromSchedule.bind(this));
			nhn.Calendar.getInstance("MainCalendarSchedule").attach("mouseup_schedule_outer", _mousemoupFromSchedule.bind(this));
		},

		/**
		 * @desc 할일 목록을 설정한다.
		 * @param aTodo
		 */
		set : function(aTodo){
			oListView.setTodoList(aTodo);
		},

		/**
		 * @desc 정렬 옵션을 반환한다.
		 */
		getSort : function(){
		},

		/**
		 * @desc 클릭한 할일 id 를 반환한다.
		 */
		getSelectedTodo : function(){
			return sTodoId;
		},

		/**
		 * @desc 보기 옵션 중 완료된 할일 포함 옵션 설정 값을 반환한다.
		 */
		getCompleted : function(){
			return bComplete;
		},

		/**
		 * @desc 그룹 옵션 설정값을 반환한다.
		 */
		getSelectedGorup : function(){
			return sGroupId;
		},

		/**
		 * @desc 그룹 정보를 갱신한다.
		 */
		setGroup : function(){
			oGroupView.update();
		},

		/**
		 * @desc 할일을 1개 추가한다.
		 * @param oTodo
		 */
		appendTodo : function(oTodo){
			oListView.append(oTodo);
		},

		/**
		 * @desc 그룹 정보를 업데이트 하다. 외부 제공 함수
		 * @param oTarget
		 * @param sValuePrefix
		 * @param bShowCnt
		 * @param nGroupId
		 * @param bEllipsis
		 */
		updateGroup : function(oTarget, sValuePrefix, bShowCnt, nGroupId, bEllipsis){
			oGroupView.setTodoGroupSelectbox(oTarget, sValuePrefix, bShowCnt, nGroupId, bEllipsis);
		},

		/**
		 * @desc 리사이즈
		 * @param nH
		 */
		resize : function(nH){
			oListView.resize(nH - 98);
		},

		/**
		 * @desc 할일 입력 컴포넌트를 초기화 한다.
		 */
		resetInsert : function(){
			oInsertView.reset();
		},

		/**
		 * @desc 할일 입력 영역에 포커싱
		 */
		focusInsert : function(){
			oInsertView.focus();
		}

	}).extend(jindo.Component))();
};