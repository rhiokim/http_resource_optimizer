/**
 * 파일 명칭
 *
 * @name nhn.Calendar
 * @namespace
 * @author rhio.kim
 * @version 0.1
 */

var TodoInsertView = function(elContainer){
	var me,
		welSubmitBtn,
		welContentIpt,
		elParent = elContainer,
		wfnClick,
		wfnBlur,
		wfnKeyPress,
		wfnFocus;

	function _setElement(){
		var aChild = $Element(elParent).child();
		welContentIpt = aChild[0];
		welSubmitBtn = aChild[1];
	}

	/**
	 * @desc 입력된 값을 반환한다.
	 */
	function _getValue(){
		return $S(welContentIpt.attr('value')).trim().$value();
	}

	/**
	 * @desc 전달된 값을 입력 영역에 설정한다.
	 * @param str
	 */
	function _setValue(str) {
		welContentIpt.attr({ value : str });
	}

	/**
	 * @desc 입력 영역에 포커싱 한다.
	 */
	function _focus(){
		welContentIpt.$value().focus();
	}

	/**
	 * @desc 입력 버튼 클릭 이벤트 핸들러
	 * @param we
	 */
	function _clickSubmitHandler(we){
		var sTodo = _getValue();

		if(sTodo == nhn.Calendar.getMessage("TXT_035")) {
			sTodo = nhn.Calendar.getMessage("TXT_011");
		}

		me.fireEvent('submit', { content : sTodo });

		if(we){
			clickcr(we.element, 'rgt.todo', '', '', we._event, 1);
			we.stop();
		}
	}

	/**
	 * @desc 블러 이벤트 핸들러
	 * @param we
	 */
	function _blurContentHandler(we){
		var sTodo = _getValue();
		welContentIpt.removeClass("on");

		if(!sTodo){
			_setValue(nhn.Calendar.getMessage("TXT_035"));
		}
	}

	/**
	 * @desc 키 입력 이벤트 핸들러
	 * @param we
	 */
	function _keypressContentHandler(we){
		if(we.key().enter){
			me.fireEvent('submit', { content : _getValue() });
		}
	}

	/**
	 * @desc 포커스 이벤트 핸들러
	 * @param we
	 */
	function _focusContentHandler(we){
		var sTodo = _getValue();
		welContentIpt.addClass('on');

		if(sTodo == nhn.Calendar.getMessage('TXT_035')){
			welContentIpt.attr({ value : '' });
		}

		welContentIpt.$value().focus();
	}

	/**
	 * @desc 이벤트를 등록한다.
	 */
	function _attachEvent(){
		wfnClick = $Fn(_clickSubmitHandler, me).attach(welSubmitBtn, 'click');
		wfnBlur = $Fn(_blurContentHandler, me).attach(welContentIpt, 'blur');
		wfnKeyPress = $Fn(_keypressContentHandler, me).attach(welContentIpt, 'keypress');
		wfnFocus = $Fn(_focusContentHandler, me).attach(welContentIpt, 'focus');
	}

	return me = new ($Class({
		$init : function(){
			_setElement();
			_attachEvent();
		},

		/**
		 * @desc 일정 입력 부분을 초기화 한다.
		 * @param we
		 */
		reset : function(we){
			_setValue('');
			_focus();
		},

		/**
		 * @alias
		 */
		focus : _focus

	}).extend(jindo.Component))();
};