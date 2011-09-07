/**
 * 할일 Ajax 모듈
 * TODO : BO 프로토콜 개선이 시급함
 *  1. Compete 필드를 다양한 용도로 사용함
 *
 * @name TodoAjax
 * @namespace
 * @author rhio.kim
 * @version 0.1
 */
var TodoAjax = function(){
	var fnCB,
		sProp;

	function _oP() {
		return {
			"dblocId"	: nhn.Calendar.getCommonConfig("userNo"),
			"lpp" : 99999,
			"count" : 40,
			"sortFieldList"	: null,
			"sortTypeList"	: null,
			"groupId" : null,
			"complete" : null,
			"todoView" : null,
			"important" : null
		}
	}

	function _clean(oParam){
		for(sProp in oParam) {
			if(oParam[sProp] == null || oParam[sProp] == undefined || oParam[sProp] == ""){
				delete oParam[sProp];
			}
		}
		return oParam;
	}

	/**
	 * @desc 넘어온 인자가 서버로 보낼 파라미터 정의와 동일 값이 있는 경우에만 병합한다.
	 * @param oParam 서버로 보낼 파마리터
	 */
	function _merge(oParam){
		var oP = _oP();
		for(sProp in oParam) {
			if(oP.hasOwnProperty(sProp)) {
				oP[sProp] = oParam[sProp];
			}
		}

		return _clean(oP);
	}

	function _callback(oRes){
		fnCB(oRes);
	}

	return {
		request : function(sAct, oParam, fC){
			oParam = _merge(oParam);
			fnCB = fC;
			nhn.Calendar.AjaxManager.request(sAct, oParam, _callback);
		}
	}
};