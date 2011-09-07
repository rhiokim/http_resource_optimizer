/**
 * 외부에서 할일로 드래그 드랍이 되는 경우
 *
 * @name nhn.Calendar
 * @namespace
 * @author rhio.kim
 * @version 0.1
 * TODO 1. 리펙토링 필요함
 */

var TodoDragDropSchedule = function(){
	var me,
		welParent,
		welList,

		_oTargetSchedule = {};

	function _setElement(){
		welParent = $$.getSingle('._todo_area');

		welList = $$.getSingle('ul._todo_container', welParent);
		welList = $Element(welList);
		welParent = $Element(welParent);
	}

	/**
	 * @desc 일정이 할 일영역으로 드래드 되어 들어오는 시점에서 mousemove 이벤트에대한 콜백함수
	 * @param {Object} we 이벤트객체
	 */
	function fpMousemoveScheduleOuter(we) {
		nhn.Calendar.getInstance("MainCalendarSchedule").attach("mousemove_schedule", fpMousemoveSchdule);

		var welTarget = we.welTarget;
		if(welParent.visible()){
			var nContainerTop = welParent.offset().top;
			var nContainerLeft = welParent.offset().left;
			var nContainerRight = nContainerLeft + welParent.width();
			var nContainerBottom = nContainerTop + welParent.height();

			// 드래깅 중인 일정 블럭의 위치를 마우스를 따라 이동시킨다.
			if(welTarget && we.nPageX > we.nGridRight && we.nPageY > nContainerTop && we.nPageY < nContainerBottom){
				if(welTarget.parent().$value() != document.body){welTarget.appendTo(document.body);}
				var nTop = we.nPageY - 5 < we.nGridTop ? we.nGridTop : we.nPageY - 5;
				nTop = nTop + 17 > nContainerBottom ? nContainerBottom - 17-3 : nTop;
				var nLeft = Math.max(we.nPageX, we.nGridLeft);
				nLeft = (nLeft+(welTarget.width()/2) < nContainerRight) ? (nLeft - welTarget.width()/2): (nContainerRight-welTarget.width()-4);
				welTarget.css({
					"width" : "151px",
					"top" : nTop+"px",
					"left" : nLeft+"px",
					"height" :"17px"
				});

//				var aElTodo = cssquery(">li", welParent);

				// 할 일목록의 배경색을 변경한다.
				welParent.addClass("select");
			}

		}
		we.stop();
	}

	/**
	 * @desc 일정이 할 일영역으로 드래드 될때 mouseup 이벤트에대한 콜백함수
	 * @param {Object} we 이벤트객체
	 */
	function fpMouseupScheduleOuter(we) {
//			if(!_bDragging && !_bScheduleMoving){return false;}
		var oRole,
			oRepeateDate,
			oFlag,
			getFlag;
		var welTarget = we.welTarget;
		var oSTD = we.oSTD;
		var nContainerTop = welParent.offset().top;
		var nContainerBottom = nContainerTop + welParent.height();

		// 할 일 영역의 백그라운드 처리
		welParent.removeClass("select");
//			_bScheduleMoving = false;

		// MainCalendarSchedule 이벤트 detach
		nhn.Calendar.getInstance("MainCalendarSchedule").detach("mousemove_schedule", fpMousemoveSchdule);
		we.stop();

		if(!oSTD) {
			return;
		}

		oRole = nhn.Calendar.getCalendarConfig(oSTD.sCalendarId, "role");

		// 준회원이면
		if(oSTD.bShare && oRole.roleId>3) {
//					alert(nhn.Calendar.getMessage("MB013_001"));
			return;
		}

		if(welTarget && we.nPageX > we.nGridRight && we.nPageX < we.nGridRight + welParent.width() && we.nPageY > nContainerTop && we.nPageY < nContainerBottom){

			if(welTarget.parent().$value() != document.body){
				welTarget.appendTo(document.body);
			}
			oRepeateDate = nhn.Calendar.getDefaultScheduleRange();
			oFlag = {
				'sRepetitionFlag'	: "",
				'sUpdateNotiFlag'	: "",
				'sShareNotiFlag'	: ""
			};
			_oTargetSchedule["scheduleId"] = oSTD.sRealScheduleId;
			_oTargetSchedule["scheduleUniqueId"] = oSTD.sScheduleId;
			_oTargetSchedule["calendarId"] = oSTD.sCalendarId;
			_oTargetSchedule["repetitive"] = oSTD.bRepetitive;
//			_sTargetScheduleUniqueId = oSTD.sScheduleId;

			// TODO 2740 - 공유일정 삭제일때 shareNotiFlag 파단해야 함
			var requestAjax = function(oResult) {
				var sShareNotiFlag = (oResult!=null)?oResult.sShareNotiFlag:"";
				var oParam = {
					"dblocId" : nhn.Calendar.getCommonConfig("userNo"),
					"calendarId" : oSTD.sCalendarId,
					"sessionId" : nhn.Calendar.getCalendarConfig(oSTD.sCalendarId, "sessionId"),
					"scheduleId" : oSTD.sRealScheduleId,
					"srcStartDate" : oSTD.sStartDate,
					"repeatStartDate" : oRepeateDate.sStartDate,
					"repeatEndDate" : oRepeateDate.sEndDate,
					"repetitionFlag" : oFlag.sRepetitionFlag,
					"updateNotiFlag" : oSTD.bShare ? "" : oFlag.sUpdateNotiFlag,
					"shareNotiFlag" : sShareNotiFlag,
					"lastUpdateDate" : nhn.Calendar.getInstance("ScheduleManager").getLastUpdateDate(oSTD.sCalendarId, oSTD.sRealScheduleId)
				};

				//TODO : 그룹이 설정된 상태에서 할일을 이동할 경우 해당 그룹에 할일이 등록되어야 한다.- rhio.kim
				// 일정을 할 일로 등록요청한다.
				if(oResult == null || oResult.bGetValue == true) {
					nhn.Calendar.AjaxManager.request("MoveSchedule2Todo", oParam, moveSchedule2Todo);
				}
			};

			getFlag = function(oValue) {
				if(oValue&&oValue['bGetValue']){
					oFlag.sRepetitionFlag = oValue['sRepetitionFlag']||oFlag.sRepetitionFlag;
					oFlag.sUpdateNotiFlag = oValue['sUpdateNotiFlag']||oFlag.sUpdateNotiFlag;
					oFlag.sShareNotiFlag = oValue['sShareNotiFlag']||oFlag.sShareNotiFlag;
					requestAjax();
				} else {
					// 할 일 영역의 백그라운드 처리
					welParent.removeClass("select");
				}
			};

			var bAnniversary = oSTD.nScheduleOriginalType == 1;
			var bRepeatNotAfter = false;

			if(oSTD.bRepetitive){
				var oThisStartDate = nhn.Calendar.DateCoreAPI.getCoreDateFormat(oSTD.sStartDate);
				if((oThisStartDate.year==oSTD.oRepeatStartDate.year)&&(oThisStartDate.month==oSTD.oRepeatStartDate.month)&&(oThisStartDate.date==oSTD.oRepeatStartDate.date)){
					bRepeatNotAfter = true;
				}
			}

			if(oSTD.bAppointed){
				if(oSTD.oAppointment.master){
					if(confirm(nhn.Calendar.getMessage("MB013_002"))){
						nhn.Calendar.checkMailDormancy(function(sEmailDormancy){
							if(sEmailDormancy == "Y" || sEmailDormancy == "R"){
								if(confirm(nhn.Calendar.getMessage("MC029_021").replace(/\{STATUS\}/g,nhn.Calendar.getMessage(sEmailDormancy == "Y" ? "TXT_082" : "TXT_083")))){
									window.open("http://mail.naver.com", '_blank');
								}
							}else{
								if(oSTD.bRepetitive){
									nhn.Calendar.ScheduleEntryPopupMain.show(nhn.Calendar.LayoutManager.getElement("wrap_fix").$value(), {'bRepeatDelete':oSTD.bRepetitive,'bRepeatNotAfter':bRepeatNotAfter,'bAnniversary':bAnniversary,'bAppointMaster':oSTD.oAppointment.master,'bAppointed':oSTD.bAppointed,'fCallback':getFlag});
								}else{
									requestAjax();
								}
							}
						});
					}
				}else{
					if(oSTD.bRepetitive){
						alert(nhn.Calendar.getMessage("MB017_003"));
					}else{
						if(confirm(nhn.Calendar.getMessage("MB013_003"))){
							nhn.Calendar.checkMailDormancy(function(sEmailDormancy){
								if(sEmailDormancy == "Y" || sEmailDormancy == "R"){
									if(confirm(nhn.Calendar.getMessage("MC029_021").replace(/\{STATUS\}/g,nhn.Calendar.getMessage(sEmailDormancy == "Y" ? "TXT_082" : "TXT_083")))){
										window.open("http://mail.naver.com", '_blank');
									}
								}else{
									oFlag.sUpdateNotiFlag = "master";
									requestAjax();
								}
							});
						}
					}
				}
			}else if(oSTD.bRepetitive || oSTD.bShare){
				if(oSTD.bShare){
					nhn.Calendar.checkMailDormancy(function(sEmailDormancy){
						if(sEmailDormancy == "Y" || sEmailDormancy == "R"){
							if(confirm(nhn.Calendar.getMessage("MC029_020").replace(/\{STATUS\}/g,nhn.Calendar.getMessage(sEmailDormancy == "Y" ? "TXT_082" : "TXT_083")))){
								window.open("http://mail.naver.com", '_blank');
							}
						}else{
							if(oSTD.bRepetitive){
								nhn.Calendar.ScheduleEntryPopupMain.show(nhn.Calendar.LayoutManager.getElement("wrap_fix").$value(), {'bRepeatDelete':oSTD.bRepetitive,'bShared':oSTD.bShare,'bRepeatNotAfter':bRepeatNotAfter,'bAnniversary':bAnniversary,'fCallback':getFlag});
							}else{
								nhn.Calendar.ScheduleEntryPopupMain.show(nhn.Calendar.LayoutManager.getElement("wrap_fix").$value(), {'bShared':true,'bAnniversary':true,'fCallback':requestAjax}); // 공유 캘린더 알림 안내
//											requestAjax();
							}
						}
					});
				}else{
					nhn.Calendar.ScheduleEntryPopupMain.show(nhn.Calendar.LayoutManager.getElement("wrap_fix").$value(), {'bRepeat':oSTD.bRepetitive,'bRepeatNotAfter':bRepeatNotAfter,'bAnniversary':bAnniversary,'fCallback':getFlag});
				}
			}else{
				requestAjax();
			}
		}
	}

	/**
	 * @desc 외부에서 mousemove 로 할일 영역에 들어온 경우 이벤트 핸들러
	 * @param we
	 */
	function fpMousemoveSchdule(we){
//		if(!_bScheduleMoving){return false;}

		nhn.Calendar.getInstance("MainCalendarSchedule").detach("mousemove_schedule", fpMousemoveSchdule);

		// 할 일목록의 배경색을 변경한다.
		welParent.removeClass("select");
		we.stop();
	}

	/**
	 * @desc 일정에서 할 일로의 이동요청후 수행되는 콜백함수
	 */
	function moveSchedule2Todo(oResponse) {
		if(oResponse.result){
			if(oResponse.result == "success") {
				/**
				 * @todo 드래그 중인것이 일정의 임시블럭일 경우 임시블럭 삭제
				 */
				var oResult = oResponse.returnValue, oTodo = oResult[oResult.length - 1];

				oResult.length = oResult.length - 1;	// 배열의 마지막 인자가 todo에 대한것이므로 날리고 스케줄만 남긴다.
				var aSchedule = oResult;

				if(_oTargetSchedule["repetitive"]) {
					// 반복일정일 경우 로컬데이터에서 반복일정 정보를 갱신한다.
					nhn.Calendar.deleteSchedule(aSchedule, _oTargetSchedule["calendarId"], _oTargetSchedule["scheduleId"], _oTargetSchedule["repetitive"]);
					// 메인 캘린더를 전체 갱신
					nhn.Calendar.getInstance("MainCalendarSchedule").getRecentlyScheduleData();
				} else {
					// 로컬데이터에서 일정정보 삭제
					nhn.Calendar.deleteSchedule(null, _oTargetSchedule["calendarId"], _oTargetSchedule["scheduleId"]);
					// 메인 캘린더를 갱신한다.
					nhn.Calendar.getInstance("MainCalendarSchedule").refreshSchedule("delete", null, _oTargetSchedule["scheduleUniqueId"]);
				}

				me.fireEvent('dropped', { todo : oTodo });
			} else {
				// 일정 -> 할 일 이동실패
				nhn.Calendar.getLatestDataByBackground(oResponse.errorCode, true);
				nhn.Calendar.showError(oResponse.errorCode, oResponse.errorMessage);
			}
		} else {
			// 응답지연 처리
		}
		// 할 일 영역의 백그라운드 처리
		welParent.removeClass("select");
	}

	return me = new ($Class({
		$init : function(){
			_setElement();
		},

		/**
		 * @alias mousemove 이벤트 핸들러
		 */
		onMouseMove : fpMousemoveScheduleOuter,

		/**
		 * @alias mouseup 이벤트 핸들러
		 */
		onMouseUp : fpMouseupScheduleOuter
	}).extend(jindo.Component))();
}