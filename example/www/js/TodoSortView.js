/**
 * 파일 명칭
 *
 * @name nhn.Calendar
 * @namespace
 * @author rhio.kim
 * @version 0.1
 */

var TodoSortView = function(elContainer){
	var me,
		elView,
		elSortPanel,
		elParent = elContainer,
		wfnClick,

		oLayoutContol,
		oSortOptionView;

	/**
	 * @desc 엘리먼트를 캐싱한다.
	 */
	function _setElement(){
		elView = $$.getSingle('._sort_link_view', elParent);
	}

	/**
	 * @desc 이벤트를 등록한다.
	 */
	function _attachEvent(){
		wfnClick = $Fn(_clickHandler, this).attach(elView, 'click');
	}

	/**
	 * @desc 보기 클릭 이벤트 핸들러
	 * @param we
	 */
	function _clickHandler(we){
		showSortPanel();
	}

	/**
	 * @desc 보기 옵션을 표시한다.
	 */
	function showSortPanel(){
		if (!elSortPanel) {
			elSortPanel = nhn.Calendar.LayoutManager.getCommonLayerElement("_todo_sort_layer");
		}
		oLayoutContol.show(elSortPanel, elView, 4, 5);
	}

	/**
	 * @desc 보기 옵션을 숨긴다.
	 */
	function hideSortPanel(){
		oLayoutContol.hide(elSortPanel, elView);
	}

	return me = new ($Class({
		$init : function(){
			_setElement();

			oLayoutContol = new nhn.LayerControl();

			oSortOptionView = new TodoSortOptionView(elSortPanel);
			oSortOptionView.attach({
				checkcomplete : function(we){
					me.fireEvent('checkcomplete', we);
				},
				selected : function(we){
					me.fireEvent('change', we);
					hideSortPanel();
				}
			});

			_attachEvent();
		},

		/**
		 * @desc 완료포함 상태를 설정한다.
		 * @param bChecked
		 */
		setContainEndTodo : function(bChecked){
			bChecked ? oSortOptionView.check() : oSortOptionView.uncheck();
		}

	}).extend(jindo.Component))();
};