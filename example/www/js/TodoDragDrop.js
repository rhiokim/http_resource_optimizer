/**
 * 파일 명칭
 *
 * @name nhn.Calendar
 * @namespace
 * @author rhio.kim
 * @version 0.1
 */

var TodoDragDrop = function(elContainer){
	var me,
		welTarget,
		welDragGhost,
		welHeader,
		welParent = $Element(elContainer),
		oPos,
		oLimit = {},
		bDragged,

		wfnMouseMove,
		wfnMouseUp;

	function _setElement(){
		welHeader = $$.getSingle('h5._head_area', welParent.$value());
		welHeader = $Element(welHeader);

		welDragGhost = nhn.Calendar.LayoutManager.getCommonLayerElement("_moving_todo", true);
	}

	/**
	 * @desc document mousemove 이벤트 핸들러
	 * @param we
	 */
	function _mousemoveDocument(we) {
		var oNowPos = we.pos();
		var nTop = oNowPos.pageY - 7;
		var nLeft = oNowPos.pageX - 79;

		if(nTop != oPos.pageX || nLeft != oPos.pageY) {
			bDragged = true;

			// 할 일 이동중 상태를 나타내는 클래스 적용
			welTarget.addClass("move_area");
			welDragGhost.show();

			// 할 일을 위한 임시 레이어를 마우스 이동에 따라 같이 이동
			if(nhn.Calendar.getInstance("MainCalendar").getGridType(we)) {	// 캘린더 영역에서 이동
				we.welTarget = welDragGhost;
				nhn.Calendar.getInstance("MainCalendarSchedule").moveToDo2Schedule(we);
			} else if(oNowPos.pageY > oLimit.top && oNowPos.pageY < oLimit.bottom && oNowPos.pageX > oLimit.left){	// 할 일 영역에서 이동
				if(welDragGhost.parentNode != document.body){
					welDragGhost.appendTo(document.body);
					nhn.Calendar.getInstance("MainCalendar").hideFocusingLayer();
				}

				nTop = oNowPos.pageY-5 < oLimit.top ? oLimit.top : oNowPos.pageY-5;
				if(nTop + welDragGhost.height() > oLimit.bottom-1 ){
					nTop = oLimit.bottom - welDragGhost.height()-1;
				}
				nLeft = (oNowPos.pageX + welDragGhost.width() / 2 > oLimit.right) ? (oLimit.right - welDragGhost.width()) : (oNowPos.pageX - welDragGhost.width()/2);
				welDragGhost.css({
					"top" : nTop + "px",
					"left" : nLeft + "px",
					"width" : "151px",
					"height" : "16px"
				});
			}
		}
		we.stop();
	}

	/**
	 * @desc document mouseup 이벤트 핸들러
	 * @param we
	 */
	function _mouseupDocument(we) {
		welDragGhost.hide();
		me.stop();

		if(bDragged) {
			this.fireEvent('drop', we);
		}else{
			this.fireEvent('click', we);
		}

		bDragged = false;
		we.stop();
	}

	/**
	 * @desc 드래그 드랍 가능한 바운더리를 설정한다.
	 */
	function _setDragBoundary(){
		var _oLayoutData = nhn.Calendar.LayoutManager.getLayoutData();

		oLimit.top = welParent.offset().top + welHeader.height();
		oLimit.left = welParent.offset().left;
		oLimit.bottom = _oLayoutData.nHeight - _oLayoutData.nFooterHeight;
		oLimit.right = _oLayoutData.nWidth;
	}

	return me = new ($Class({
		$init : function(){
			_setElement();
		},

		/**
		 * @desc drag 시작 설정
		 * @param we
		 */
		start : function(we){
			welTarget = we.target;
			oPos = we.pos;
			welDragGhost.html(we.sTitle);

			_setDragBoundary();

			wfnMouseMove = $Fn(_mousemoveDocument, this).attach(document, 'mousemove');
			wfnMouseUp = $Fn(_mouseupDocument, this).attach(document, 'mouseup');
		},

		/**
		 * @desc drag 종료 설정
		 */
		stop : function(){
			welTarget.removeClass('move_area');
			wfnMouseMove.detach(document, 'mousemove');
			wfnMouseUp.detach(document, 'mouseup');
		}
	}).extend(jindo.Component))();
};