/**
 * 파일 명칭
 *
 * @name nhn.Calendar
 * @namespace
 * @author rhio.kim
 * @version 0.1
 */

var TodoSortOptionView = function(elContainer){
	var me,
		welDone,
		welPrev,
		aChild,
		elRegDateSort,
		elCompleteDateSort,
		elImpotantSort,
		elParent = elContainer,

		wfnClick,
		wfnMouseOver,

		welSortType,

		oSort = {
			complete : true/*,
			sortTypeList : 'ASC',
			sortFieldList :'registerDate'*/
		};

	/**
	 * @desc 엘리먼트를 캐싱한다.
	 */
	function _setElement(){
		aChild = $$('ul > li', elParent);

		welDone = $Element(aChild[0]);
		elRegDateSort = aChild[1];
		elCompleteDateSort = aChild[2];
		elImpotantSort = aChild[3];
	}

	/**
	 * @desc 완료포함을 체크한다.
	 * @param we
	 */
	function _check(){
		oSort.complete = true;
		welDone.addClass('checked');
	}

	/**
	 * @desc 완료포함을 언체크한다.
	 * @param we
	 */
	function _uncheck(){
		oSort.complete = false;
		welDone.removeClass('checked');
	}

	/**
	 * @desc 정렬 값을 반환한다.
	 * @param sFieldList
	 */
	function _getSortOrder(sFieldList){
		if(oSort.sortFieldList != sFieldList) {
			return 'DESC';
		}

		return (oSort.sortTypeList == 'DESC') ? 'ASC' : 'DESC' ;
	}

	/**
	 * @desc 완료포함 클릭 이벤트 토글 핸들러
	 * @param we
	 */
	function _clickDoneHandler(we){
		oSort.complete ? _uncheck() : _check();
		me.fireEvent('checkcomplete', oSort);
		we.stop();
	}

	/**
	 * @desc 정렬 클릭 이벤트 핸들러
	 * @param we
	 */
	function _clickSortHandler(we){
		var wel = $Element(we.element);
		var sType;

		if(welPrev){
			welPrev.removeClass('selected');
		}

		switch(we.element) {
			case aChild[1] :
					sType = 'registerDate';
			break;
			case aChild[2] :
					sType = 'endDate';
			break;
			case aChild[3] :
					sType = 'importance';
			break;
			default :
				return null;
			break;
		}
		oSort.sortTypeList = _getSortOrder(sType);
		oSort.sortFieldList = sType;

		welPrev = wel.addClass('selected');

		me.fireEvent('selected', oSort);
	}

	/**
	 * @desc 정렬 영역 마우스 오버 이벤트 핸들러
	 * @param we
	 */
	function _mouseoverHandler(we){
		var wel = $Element(we.element);

		switch(we.element) {
			case aChild[1] :
			break;
			case aChild[2] :
			break;
			case aChild[3] :
			break;
			default :
				return null;
				break;
		}

		if(welSortType) {
			welSortType.removeClass('over');
		}
		wel.addClass('over');

		welSortType = wel;
	}

	/**
	 * @desc 이벤트를 등록한다.
	 */
	function _attachEvent(){
		wfnClick = $Fn(_clickDoneHandler, this).attach(welDone.$value(), 'click');
		wfnMouseOver = $Fn(_mouseoverHandler, this).attach(elParent, 'mouseover');
		wfnMouseOver = $Fn(_clickSortHandler, this).attach(elParent, 'click');
	}

	return me = new ($Class({
		$init : function(){
			_setElement();
			_attachEvent();
		},

		/**
		 * @alias 완료포함을 체크한다.
		 */
		check : _check,

		/**
		 * @alias 완료포함 언체크한다.
		 */
		uncheck : _uncheck

	}).extend(jindo.Component))();
};