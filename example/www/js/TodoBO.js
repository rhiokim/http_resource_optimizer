/**
 * 할일 BO
 *
 * @name TodoBO
 * @namespace
 * @author rhio.kim
 * @version 0.1
 */

var TodoBO = function(aTodo){
	var aData = aTodo,
		oIndex = {},
		nLen;

	/**
	 * @private
	 * @desc todo 아이디로 인덱싱 처리
	 */
	function indexing(){
		var i = 0,
			oItem;
		nLen = aData.length;

		for(i; i < nLen; i++){
			oItem = aData[i];
			oIndex[oItem.todoId] = i;
		}
	}

	/**
	 * @private
	 * @desc todo 가 수정된 경우 업데이트 한다.
	 * @param oTodo
	 */
	function _update(oTodo){
		var nIndex = oIndex[oTodo.todoId];
		aData[nIndex] = oTodo;
	}

	/**
	 * @private
	 * @desc todo 를 추가한다.
	 * @param oTodo
	 */
	function _insert(oTodo, nIdx){
		nIdx = nIdx || 0;
		aData.splice(nIdx, 0, oTodo);
		indexing();
	}

	/**
	 * @private
	 * @desc row 값을 반환한다.
	 * @param nIdx row 인덱스
	 */
	function _row(nIdx){
		return aData[nIdx];
	}

	indexing();

	return {
		/**
		 * @desc todo 를 모두 반환한다.
		 */
		getAll : function(){
			return aData;
		},

		/**
		 * @desc todo 를 설정한다.
		 * @param aTodo
		 */
		set : function(aTodo) {
			aData = aTodo;
			indexing();
		},

		/**
		 * @desc todo 정보를 객체로 반환한다.
		 * @param sId todo_id
		 */
		getById : function(sId){
			var nIndex = oIndex[sId];
			return _row(nIndex);
		},

		/**
		 * @desc todo 를 반환한다.
		 * @param nIdx
		 */
		getRow : function(nIdx){
			return aData[nIdx];
		},

		/**
		 * @desc 첫번째 todo 정보를 반환한다.
		 */
		getFirstRow : function(){
			return _row(0);
		},

		/**
		 * @desc 마지막 todo 정보를 반환한다.
		 */
		getLastRow : function(){
			return _row(nLen-1);
		},

		/**
		 * @desc todo 를 첫번째에 추가한다.
		 * @param oTodo
		 */
		append : function(oTodo){
			_insert(oTodo, 0);
		},

		/**
		 * @desc todo 를 업데이트 한다.
		 * @param oTodo
		 */
		update : function(oTodo){
			_update(oTodo);
		}
	}
};