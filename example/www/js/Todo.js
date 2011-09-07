
/**
 * 할 일 목록 (UIO-B013)
 *
 * @name nhn.Calendar.ToDo
 * @namespace
 * @author icebelle
 * @modified netil (2010-07-22)
 */
var Todo = function(aTodo, bComplete){
	var me,
		nMaxCount = 40,
		oBO = new TodoBO(aTodo),
		oAjax = new TodoAjax();

	var oView = new TodoView(bComplete);
		oView.attach({
			//use case : 더보기 클릭
			clickmore : function(we){
				nhn.Calendar.LayoutManager.showUIO("ToDoList", { "complete" : we.complete ? "ALL" : "N" });
			},
			//use case : 정렬 변경
			changesort : function(we){
				var oParameter = {
					"dblocId"	: nhn.Calendar.getCommonConfig("userNo"),
					"lpp" : 99999,
					"sortFieldList"	: we.sortFieldList,
					"sortTypeList"	: we.sortTypeList,
					"complete" : we.complete ? "All" : "N"
				};
				if(we.groupId) {
					oParameter.groupId = we.groupId;
				}
				// 할 일목록 조회
				nhn.Calendar.AjaxManager.request("GetTodoListByPage", oParameter, me.updateHandler.bind(me));
			},
			//use case : 완료된 일정 포함
			containendtodo : function(we){
				var oParameter = {
					"dblocId"	: nhn.Calendar.getCommonConfig("userNo"),
					"count" : nMaxCount,
					"complete" : we.complete ? "All" : "N",
					"todoView" : we.complete
				};
				if(we.groupId) {
					oParameter.groupId = we.groupId;
				}
				// 할 일목록 조회
				nhn.Calendar.AjaxManager.request("GetTodoListWithSetView", oParameter, me.updateHandler.bind(me));
			},
			//use case : 그룹 선택박스 변경
			changegroup : function(we){
				var oParameter = {
					"dblocId" : nhn.Calendar.getCommonConfig("userNo"),
					"count" : nMaxCount,
					"groupId" : we.groupId,
					"complete" : we.complete ? "All" : "N",
					"todoView" : we.complete
				};
				// 할 일목록을 가져온다.
				nhn.Calendar.AjaxManager.request("GetTodoListWithSetView", oParameter, me.updateHandler.bind(me));
			},
			//use case : 할일 입력 버튼 클릭
			createtodo : function(we){
				var oParameter = {
					"dblocId" : nhn.Calendar.getCommonConfig("userNo"),
					"content" : we.content,
					"groupId" : we.groupId
				};

				nhn.Calendar.AjaxManager.request("CreateTodo", oParameter, me.appendHandler.bind(me));
			},
			//use case : 할일 타이틀을 클릭
			modifytodo : function(we){
				nhn.Calendar.ModifyToDo.show(we.todoId);
				clickcr(we.element, 'rgt.info', '', '', we._event, 1);
			},
			//use case : 할일 목록에서 완료 클릭
			completetodo : function(we) {
				var bTodoCompleteStatus = !oBO.getById(we.todoId).complete;
				var oParameter = {
					"dblocId" : nhn.Calendar.getCommonConfig("userNo"),
					"todoId" : we.todoId,
					"complete" : bTodoCompleteStatus	//[개선필요] BO 요청 시 동일한 필드를 여러 용도로 사용하고 있다. 2011.08 by rhiokim
				};

				nhn.Calendar.AjaxManager.request ("SetComplete", oParameter, me.completeHandler.bind(me));
				clickcr(we.element, 'rgt.check', '', '', we._event, 1);
			},
			//use case : 할일 목록에서 중요도 클릭
			changeimportant : function(we){
				var bImportantStatus = oBO.getById(we.todoId).importance > 0 ? false : true;
				var oParameter = {
					"dblocId" : nhn.Calendar.getCommonConfig("userNo"),
					"todoId" : we.todoId,
					"important" : bImportantStatus	//[개선필요] BO 요청 시 동일한 필드를 여러 용도로 사용하고 있다. 2011.08 by rhiokim
				};

				nhn.Calendar.AjaxManager.request ("SetImportance", oParameter, me.importantHandler.bind(me));
			},
			//use case : 할일을 드래그 해서 캘린더 뷰 영역에 드랍
			droppedschedule : function(we){
				var oTodo = oBO.getById(we.todoId);
				nhn.Calendar.getInstance("MainCalendarSchedule").attachToDo2Schedule(we.event, oTodo, me.moveTodo2Schedule.bind(me));
			},
			//use case : 일정을 드래그 해서 할일 영역에 드랍
			droppedtodo : function(we){
				var oTodo = we.todo;
				oBO.append(oTodo);
				oView.appendTodo(oTodo);
				oView.setGroup();

				nhn.Calendar.ToDoList.setGroupData(0, "totalTodoCount", 1);
//				me.refresh();
			}
		});


	/**
	 * @desc 할 일 목록을 요청하는 함수
	 */
	function update() {
		var bComplete = oView.getCompleted();
		var oParameter = {
			"dblocId" : nhn.Calendar.getCommonConfig("userNo"),
			"count" : nMaxCount,
			"groupId" : oView.getSelectedGorup(),
			"complete" : bComplete ? "All" : "N",
			"todoView" : bComplete
		};

		nhn.Calendar.AjaxManager.request("GetTodoListWithSetView", oParameter, me.updateHandler.bind(me));
	}


	return me = new ($Class({
		$init : function(){
			var aTodo = oBO.getAll();
			oView.set(aTodo);
			oView.setGroup();
		},

		updateHandler : function(oResponse){
			var aTodo;

			if(oResponse.result) {
				if(oResponse.result == "success"){
					aTodo = oResponse.returnValue;
					oBO.set(aTodo);
					oView.set(aTodo);

					oView.setGroup();	//showTodoGroupSelectbox();
				} else {
					// 할 일 목록 가져오기 실패
					nhn.Calendar.showError(oResponse.errorCode, oResponse.errorMessage);
				}
			} else {
				// 응답지연 처리
			}
		},

		appendHandler : function(oResponse){
			if(oResponse.result){
				if(oResponse.result == "success"){
					var oTodo = oResponse.returnValue;
					// 할 일을 등록요청후 할 일입력 텍스트박스의 내용을 비운다.
					oView.resetInsert();

					// 필터가 '전체할 일'로 선택되어 있는 경우에만 목록을 업데이트 한다.
					if(/^(?:0|all)$/.test(oView.getSelectedGorup())) {
						oBO.append(oTodo);
						oView.appendTodo(oTodo);

						// 우측이 할 일 목록페이지이면 목록 갱신
						if(nhn.Calendar.LayoutManager.getPageId() == "ToDoList") {
							nhn.Calendar.ToDoList.refresh();
						}
						nhn.Calendar.ToDoList.setGroupData(0, "totalTodoCount", 1);
					} else {
						update();
						nhn.Calendar.ToDoList.setGroupData(oResponse.returnValue.groupId, "totalTodoCount", 1);
					}
					// 추가 되었으므로, 그룹 data에서 해당 그룹에 속한 글의 개수를 증가시킨다.
					// selectbox에서 '그룹없음' option의 개수를 1 증가해 노출한다.

						oView.setGroup();
				} else {
					// 할 일 등록 요청 실패
					nhn.Calendar.showError(oResponse.errorCode, oResponse.errorMessage);
				}
			} else {
				// 응답지연 처리
			}
		},

		deleteHandler : function(oResponse){

		},

		completeHandler : function(oResponse){
			if(oResponse.result) {
				if(oResponse.result == "success"){
					var oTodo = oResponse.returnValue;
					oBO.update(oTodo);
					oView.set(oBO.getAll());

					// 우측이 할 일 목록페이지이면 목록 갱신
					if(nhn.Calendar.LayoutManager.getPageId() == "ToDoList"){
						nhn.Calendar.ToDoList.refresh();
					}

					// 그룹 data에서 해당 그룹에 속한 완료된 글의 개수를 update 한다.
					nhn.Calendar.ToDoList.setGroupData( oView.getSelectedGorup(), "completeTodoCount", bComplete ? 1 : -1);
				} else {
					// 완료여부 토글저장 실패
					nhn.Calendar.showError(oResponse.errorCode, oResponse.errorMessage);
				}
			} else {
				// 응답지연 처리
			}
		},

		importantHandler : function(oResponse){
			if(oResponse.result) {
				if(oResponse.result == "success"){
					var oTodo = oResponse.returnValue;
					oBO.update(oTodo);
					oView.set(oBO.getAll());

					// 우측이 할 일 목록페이지이면 목록 갱신
					if(nhn.Calendar.LayoutManager.getPageId() == "ToDoList"){
						nhn.Calendar.ToDoList.refresh();
					}

					// 그룹 data에서 해당 그룹에 속한 완료된 글의 개수를 update 한다.
					nhn.Calendar.ToDoList.setGroupData( oView.getSelectedGorup(), "completeTodoCount", bComplete ? 1 : -1);
				} else {
					// 완료여부 토글저장 실패
					nhn.Calendar.showError(oResponse.errorCode, oResponse.errorMessage);
				}
			} else {
				// 응답지연 처리
			}
		},

		/**
		 * @regercy
		 */
		ResizeList : function(nHeight){
			oView.resize(nHeight);
		},

		/**
		 * @regercy
		 * @desc 지정된 selectbox element에 option을 추가해 할 일 그룹을 구성한다.
		 *
		 * @param {Object} oTarget - 추가될 selectbox element
		 * @param {String} sValuePrefix - value 앞에 추가될 prefix string
		 * @param {Boolean} bShowCnt - 할 일 개수를 그룹명과 같이 노출할지 여부.
		 * 								개수가 표현되는 option은 span으로 감싼 후 title을 사용해 그룹명을 툴팁으로 노출한다.
		 * @param {Number} nGroupId - 선택 처리될 그룹 ID
		 * @param {Boolean} bEllipsis - 그룹명에 말줄임 처리를 할지 여부
		 */
		setTodoGroupSelectbox : function(oTarget, sValuePrefix, bShowCnt, nGroupId, bEllipsis){
			oView.updateGroup(oTarget, sValuePrefix, bShowCnt, nGroupId, bEllipsis);
		},

		/**
		 * @regercy
		 * @desc 할일 영역을 새로 갱신한다.
		 */
		refresh : function(){
			var bComplete = oView.getCompleted(),
				nGroupId = oView.getSelectedGorup();

			var oParameter = {
				"dblocId" : nhn.Calendar.getCommonConfig("userNo"),
				"count" : nMaxCount,
				"complete" : bComplete ? "All" : "N",
				"todoView" : bComplete
			};

			if(nGroupId) {
				oParameter.groupId = nGroupId;
			}

			// 할 일목록을 가져온다.
			nhn.Calendar.AjaxManager.request("GetTodoListWithSetView", oParameter, me.updateHandler.bind(me));
		},


		/**
		 * @desc 할 일을 일정으로 등록요청후 수행되는 콜백함수
		 * @param {Boolean} bResult 할 일 드래그 성공여부
		 * @param {Object} oTodayTodoCount 오늘의 할 일 개수
		 */
		moveTodo2Schedule : function(bResult, oTodayTodoCount) {
			if(!bResult){return false;}

			// 할 일 데이터를 삭제
			this.refresh();

			// 삭제 되었으므로, 그룹 data에서 해당 그룹에 속한 글의 개수를 감소시킨다.
			nhn.Calendar.ToDoList.setGroupData(oView.getSelectedGorup(), "totalTodoCount", -1);
			oView.setGroup();

			if (oTodayTodoCount != null) {
				// 오늘의 할 일 개수 갱신
				nhn.Calendar.setLocalData("oTodayTodoCount", oTodayTodoCount);
			}
		},

		setFocus : function(){
			oView.focusInsert();
		},

		/**
		 * TODO : 레거시 코드/의존성 제거 해야함/TodoList.js
		 * @desc 할일 그룹을 표시한다.
		 *
		 */
		showTodoGroupSelectbox : function(){
			oView.setGroup();
		},

	/**
	 * @regarcy
	 * TODO : 레거시 코드/의존성 제거 해야함/TodoList.js
	 * @desc 그룹명 또는 할 일 개수 표현
	 * - 그룹명 : 5글자 이상인 경우, 5글자로 자른 후, 말줄임(...) 표시
	 * - 할 일 개수 : 99개 이상인 경우 "99+"로 표시
	 *
	 * @param {String} sType (name 그룹명|count 할 일 개수)
	 * @param {String|Number} value 그룹명 또는 할 일 개수
	 * @param {Boolean} bEllipsis 그룹명의 경우, 말줄임 사용여부. 값을 지정하지 않으면 사용으로 처리
	 */
	getFormattedValue : function(sType, value, bEllipsis, msg) {
		var oLimit = { "name" : 5, "count" : 99 };

		if(sType == "name") {
			if(bEllipsis !== false){
				if(msg == null){
					value = nhn.Utility.cutStringByPixel(value, 80, "..");
				}else{
					value = nhn.Utility.cutStringByPixelIncludeTail(value, 85, "..", msg);
				}

			}
		} else if(sType == "count" && value > oLimit[sType]) {
			value = oLimit[sType] + "+";
		}

		return value;
	},

	/**
	 * @regarcy
	 * TODO : 레거시 코드/의존성 제거 해야함/TodoList.js
	 * 할 일 전체보기에서 선택삭제를 했을경우 콜백함수
	 */
	selectedListDelete : function() {
		var bComplete = oView.getCompleted();
		var nGroupId = oView.getSelectedGorup();

		var oParameter = {
			"dblocId" : nhn.Calendar.getCommonConfig("userNo"),
			"count" : nMaxCount,
			"complete" : bComplete ? "All" : "N",
			"todoView" : bComplete
		};
		if(nGroupId) {
			oParameter.groupId = nGroupId;
		}
		// 할 일목록을 가져온다.
		nhn.Calendar.AjaxManager.request("GetTodoList", oParameter, this.updateHandler.bind(this));
	}

	}).extend(jindo.Component))();
};
