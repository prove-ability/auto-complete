export function debounce(callback, wait) {
	let timeout; // 초기 undefined

	// 함수가 호출시 매번 반환
	return function (...args) {
		const context = this;

		// setTimeout, setInterval 타이머를 취소
		// 반복된 요청이 들어왔을 때 이전 요청을 취소시켜준다.
		clearTimeout(timeout);
		timeout = setTimeout(() => callback.apply(context, args), wait);
	};
}
