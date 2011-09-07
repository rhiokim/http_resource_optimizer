/**
 * 할일 그룹 선택 클래스
 *
 * @name nhn.Calendar
 * @namespace
 * @author rhio.kim
 * @version 0.1
 */

var TodoGroupView = function(elContainer){
	var me,
		elGroupSelect = $$.getSingle('._todo_area_group_select', elContainer);

	/**
	 * 그룹 선택 박스
	 */
	var oGroupCompo= new nhn.SelectBox($$.getSingle('._todo_area_group', elContainer), {
			"height" : 190,
			"disabledBackgroundColor" : "#ffffff",
			"overflowX" : "hidden",
			"useHtml" : true
		});
		oGroupCompo.attach({
			change : function(we){
				me.fireEvent('change', { groupId : _getGroupId() });
			}
		});

	/**
	 * @desc 현재 선택된 그룹값을 반환 한다.
	 */
	function _getGroupId() {
		var groupId = elGroupSelect.value;
		if (isNaN(groupId)) {
			return null;
		}
		return parseInt(groupId);
	}

	/**
	 * @deprecated
	 * 할 일 목록 요청시, 필터 옵션의 parameter 값을 설정한다.
	 */
	function _getFilterOption() {
	}

	/**
	 * @desc 할 일 그룹 목록을 반환한다.
	 * @return {Array}
	 *   [
	 * 		{ id : {Number} 그룹ID, name : {String} 그룹명 },
	 * 		...
	 * 	 ]
	 */
	function _getTodoGroupList() {
		var oGroup = nhn.Calendar.getLocalData("oTodoGroupList"), aRet = [];

		for(var i=0, el; el = oGroup[i]; i++) {
			aRet.push({ "id" : el.groupId, "name" : $S(el.groupName).escapeHTML().$value(), "cnt" : el.totalTodoCount });
		}

		return aRet;
	}

	function _getFormattedCount(nCount){
		return (nCount > 99) ? '(99+)' : (nCount > 0 ? '('+nCount+')' : '');
	}

	function _getFormattedContent(sContent, bEllipsis, msg){
		if(bEllipsis !== false){
			if(msg == null){
				sContent = nhn.Utility.cutStringByPixel(sContent, 80, "..");
			}else{
				sContent = nhn.Utility.cutStringByPixelIncludeTail(sContent, 85, "..", msg);
			}
		}
		return sContent
	}

	return me = new ($Class({
		$init : function(){},
		update : function(){
			var i,
				oData,
				sCnt = '',
				sFilterValue = elGroupSelect.value,
				oTodayTodoCount = nhn.Calendar.getLocalData("oTodayTodoCount"),
				aData = [
					{ name : "전체 할 일", value : "all" }
				];

			if(sFilterValue === "") {
				sFilterValue = "all";
			}

			nhn.Utility.removeSelectboxOption(elGroupSelect);

			for(i = 0; oData = aData[i]; i++) {
				sCnt = _getFormattedCount(oData.count);
				nhn.Utility.addSelectboxOption(elGroupSelect, oData.value, oData.name + sCnt, sFilterValue === oData.value);
			}

			this.setTodoGroupSelectbox(elGroupSelect, "", true, sFilterValue);
			oGroupCompo.paint();
		},


		/**
		 * 지정된 selectbox element에 option을 추가해 할 일 그룹을 구성한다.
		 *
		 * @param {Object} oTarget - 추가될 selectbox element
		 * @param {String} sValuePrefix - value 앞에 추가될 prefix string
		 * @param {Boolean} bShowCnt - 할 일 개수를 그룹명과 같이 노출할지 여부.
		 * 								개수가 표현되는 option은 span으로 감싼 후 title을 사용해 그룹명을 툴팁으로 노출한다.
		 * @param {Number} nGroupId - 선택 처리될 그룹 ID
		 * @param {Boolean} bEllipsis - 그룹명에 말줄임 처리를 할지 여부
		 */
		setTodoGroupSelectbox : function(oTarget, sValuePrefix, bShowCnt, nGroupId, bEllipsis) {
			var aList = _getTodoGroupList(),
				sName = "",
				countMsg;

			sValuePrefix = sValuePrefix || "";
			nGroupId = parseInt(nGroupId);
			bEllipsis = bEllipsis !== false;

			for(var i = 0, el; el = aList[i]; i++) {
//				sName = bEllipsis ? getFormattedValue("name", el.name) : $S(el.name).unescapeHTML().$value();
				sName = bEllipsis ? _getFormattedContent(el.name) : $S(el.name).unescapeHTML().$value();

				if(bShowCnt && "cnt" in el) {
//					countMsg = " (" + getFormattedValue("count", el.cnt) + ")" ;
					countMsg = _getFormattedCount(el.cnt);
					sName = bEllipsis ? _getFormattedContent(el.name, true, countMsg ) : $S(el.name).unescapeHTML().$value() + countMsg;
					sName = ["<span title=\"", $S(el.name).unescapeHTML().$value() ,"\">", sName, "</span>"].join("");
				}

				nhn.Utility.addSelectboxOption(oTarget, sValuePrefix + el.id, sName, nGroupId === el.id);
			}
		}
	}).extend(jindo.Component))()
};