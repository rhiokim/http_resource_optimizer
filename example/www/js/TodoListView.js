/**
 * 파일 명칭
 *
 * @name nhn.Calendar
 * @namespace
 * @author rhio.kim
 * @version 0.1
 */

var TodoListView = function(elContainer){
	var me,
		welList,
		welParent = elContainer,
		welPrev,
		welTarget,
		wfnMouseOver,
		wfnMouseOut,
		wfnMouseDown;

	function _setElement(){
		welList = $$.getSingle('ul._todo_container', welParent);
		welList = $Element(welList);

		welParent = $Element(welParent);
	}

	/**
	 * @desc 일정 드래그를 위한 dragStart 처리 함수
	 * @param {Object} we		이벤트 객체
	 */
	function _dragStart(we) {
		// 일정블럭의 텍스트부분(a태그)를 잡고도 드래그가 가능하도록 return false 처리 (IE에서 A태그는 드래그불가)
		return false;
	}

	/**
	 * @desc 할일 영역을 클리어 한다.
	 */
	function _clear(){
		welList.empty();
	}

	/**
	 * @desc todo 항목의 템플릿을 적용하여 문자열로 반환한다.
	 * @param oItem
	 */
	function _makeTodoItem(oItem){
		var sItem,
			sId = oItem.todoId,
			sLevel = 3 - oItem.importance,
			sImpo = (oItem.complete) ? "TXT_013" : "TXT_012",
			sContent = (oItem.content !== 0 && oItem.content === false || oItem.content == "") ? nhn.Calendar.getMessage("TXT_011") : $S(oItem.content).unescapeHTML().$value(),
			sLimit = "(기한:" + (oItem.endDate || "없음") + ")",
			sEndDate = '',
			sFin = (oItem.complete) ? 'fin' : '';

		sContent = nhn.Utility.replaceWhiteSpace(oItem.content);

		if(oItem.limit && oItem.endDate != "" && typeof(oItem.endDate) != "undefined"){
			sEndDate = "<span class='date'>" + nhn.Calendar.DateCoreAPI.convertTodoDueDateFormat(oItem.endDate) + "</span>";
		}

		sItem = TodoListView._templateItem.replace(/#{level}/g, sLevel);
		sItem = sItem.replace(/#{id}/g, sId);
		sItem = sItem.replace(/#{content}/g, sContent);
		sItem = sItem.replace(/#{impo}/, sImpo);
		sItem = sItem.replace(/#{limit}/, sLimit);
		sItem = sItem.replace(/#{end}/, sEndDate);
		sItem = sItem.replace(/#{fin}/, sFin);

		return sItem;
	}


	/**
	 * @desc 드래그 가능 영역에 mouseover/mouseout 이벤트 처리 함수
	 * @param {Obejct} we				이벤트 객체
	 */
	function _mouseoverDragArea(we){
		var elTarget = we.element;
		var elLi = $$.test(elTarget, "li") ? elTarget : $$.getSingle("! li" ,elTarget);
		var ff = we.of(elLi);
		if(ff){return false;}

		if(we.type == "mouseover") {
			welPrev = $Element(elLi).addClass("over_area");
		} else {
			$Element(elLi).removeClass("over_area");
			welPrev = null;
		}
	}
	/**
	 * @desc mouseover 이벤트 핸들러
	 * @param we
	 */
	function _mouseoverHandler(we){
		var elTarget = we.element;
		if($$.test(elTarget, "ul")) {
			if(welPrev && we.type == "mouseout") {
				welPrev.removeClass("over_area");
				welPrev = null;
			}
			return false;
		}

		_mouseoverDragArea(we);
	}

	/**
	 * @desc mouseout 이벤트 핸들러
	 * @param we
	 */
	function _mouseoutHandler(we){
		_mouseoverHandler(we);
	}

	/**
	 * @desc mousedown 이벤트 핸들러
	 * @param we
	 */
	function _mousedownHandler(we){
		var oParam,
			elSpan;

		if(!we.mouse().left || $$.test(we.element, "ul")){
			return false;
		}

		welTarget = $$.test(we.element, "li") ? we.element : $$.getSingle("! li", we.element);
		welTarget = $Element(welTarget);
		elSpan = $$.getSingle('span._todo_list_content', welTarget.$value());

		oParam = { element : we.element, pos : we.pos(), _event : we._event, target : welTarget, todoId : welTarget.first().attr('id'), sTitle : elSpan.innerHTML };

		me.fireEvent('mousedown', oParam);

		we.stop();
	}

	/**
	 * @desc mouseup 이벤트 핸들러
	 * @param we
	 */
	function _mouseupHandler(we){
		var wel = $Element(we.element);

		if(wel.hasClass('_todo_list_complete')) {
			me.fireEvent('checkcomplete', we);
		}else if(wel.hasClass('_todo_link_level')){
			me.fireEvent('clickimpotant', we);
		}else{
			me.fireEvent('clickcontent', we);
		}

		we.stop();
	}

	function _attachEvent(){
		wfnMouseOver = $Fn(_mouseoverHandler, this).attach(welList, 'mouseover');
		wfnMouseOut = $Fn(_mouseoutHandler, this).attach(welList, 'mouseout');
		wfnMouseDown = $Fn(_mousedownHandler, this).attach(welList, 'mousedown');

		$Fn(_dragStart, this).attach(welList, "dragstart");
	}

	return me = new ($Class({
		$init : function(){
			_setElement();
			_attachEvent();
		},

		/**
		 * @desc 할일 1개를 추가한다.
		 * @param oTodo
		 */
		append : function(oTodo){
			var sList = _makeTodoItem(oTodo);

			welList.prepend($(sList));
		},

		/**
		 * @desc 목록 리사이즈
		 * @param nH
		 */
		resize : function(nH){
			welList.height(nH);
		},

		/**
		 * @desc 마우스 클릭 이벤트 핸들러(드래그 드랍에서 드래그 없이 mouseup 이벤트 발생 시 클릭으로 처리하기 위해서)
		 * @param we
		 */
		click : _mouseupHandler,

		/**
		 * @desc 할 일 목록 요청후 수행되는 콜백함수
		 * @param {Array} aTodo
		 */
		setTodoList : function(aTodo){
			var i = 0,
				oItem,
				sList = '';

			_clear();

			for(i, oItem; oItem = aTodo[i]; i++) {
				if(!oItem.content != 0 && (oItem.content === false || oItem.content == "")) {
					oItem.content = nhn.Calendar.getMessage("TXT_011");
				}

				// 할 일 데이터를 저장한 후, 목록을 구성한다.
				sList += _makeTodoItem(oItem);
			}
			welList.html(sList);
		}

	}).extend(jindo.Component))();
};

/**
 * 할일 아이템 기본 템플릿
 */
TodoListView._templateItem = '\
		<li class="_todo_list #{fin} level_v#{level}">\
			<input id="#{id}" class="_todo_list_complete" type="checkbox" title="#{impo}" style="width:15px;">\
			<label class="_todo_list_complete" style="width:15px;" for="#{id}"></label>\
			<a class="_todo_link_level link_level level#{level}" onclick="return false;" href="#"></a>\
			<a class="_todo_list_content link_cont" onclick="return false;" href="#">\
				<span class="_todo_list_content ellipsis" title="#{limit} #{content}">#{content}</span>\
			</a>\
			#{end}\
		</li>';