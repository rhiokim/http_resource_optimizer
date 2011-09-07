/**
 * 파일 명칭
 *
 * @name nhn.Calendar
 * @namespace
 * @author rhio.kim
 * @version 0.1
 */

var TodoHeaderView = function(elContainer){
	var me,
		elMore,
		elParent = elContainer,
		wfnClick;

	/**
	 * @desc 엘리먼트를 캐싱한다.
	 */
	function _setElement(){
		elMore = $$.getSingle('._todo_all_list_btn', elParent);
	}

	/**
	 * @desc 더보기 클릭 이벤트 핸들러
	 * @param we
	 */
	function _clickHandler(we){
		we.stop();
		me.fireEvent('seemore', we);
	}

	/**
	 * @desc 이벤트를 등록한다.
	 */
	function _attachEvent(){
		wfnClick = $Fn(_clickHandler, this).attach(elMore, 'click');
	}

	return me = new ($Class({
		$init : function(){
			_setElement();
			_attachEvent();
		}

	}).extend(jindo.Component))();
};