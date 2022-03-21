import { fetchData } from "../utils/apis.js";
import { debounce } from "../utils/libs.js";

export default function AutoComplete({ $root }) {
	const $component = document.createElement("div");
	$component.className = "auto-complete";
	$component.setAttribute("role", "search");
	$component.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgba(134, 136, 138, 1);transform: ;msFilter:;"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path></svg>
    <input class="input" list="movies"/>
    <svg class="clear" xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgba(134, 136, 138, 1);transform: ;msFilter:;"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
  `;
	$root.appendChild($component);

	// style
	const $stylesheet = document.createElement("link");
	$stylesheet.rel = "stylesheet";
	$stylesheet.href = "components/style.css";
	document.getElementsByTagName("head")[0].appendChild($stylesheet);

	const $input = $component.querySelector(".input");

	// focus
	$component.addEventListener("click", () => {
		$input.focus();
	});

	// clear
	const $clear = document.querySelector(".clear");
	$clear.style.visibility = "hidden";
	$clear.addEventListener("click", () => {
		$input.value = "";
	});

	// select
	const $select = document.createElement("div");
	$select.className = "select";
	$select.setAttribute("id", "movies");

	// focus out
	$input.addEventListener("focusout", () => {
		$select.remove();
	});

	const $container = document.createElement("div");
	$container.className = "container";
	$input.addEventListener("keydown", (e) => {
		if (e.code === "ArrowUp" || e.code === "ArrowDown") {
			const $options = $container.querySelectorAll(".option");
			if ($options.length === 0) return;
			let index = parseInt($container.querySelector(".selected").dataset.index);

			if (e.code === "ArrowDown") {
				index += 1;
				if (index === $options.length) index = 0;
			} else if (e.code === "ArrowUp") {
				index -= 1;
				if (index < 0) index = $options.length - 1;
			}
			$options.forEach(($option) => {
				if ($option.dataset.index === index + "")
					$option.classList.add("selected");
				else $option.classList.remove("selected");
			});
		}
	});

	const onChangeInput = debounce(async (e) => {
		if (e.code === "ArrowDown" || e.code === "ArrowUp") return;
		const value = e.target.value;
		if (!value) {
			$clear.style.visibility = "hidden";
			return;
		}
		$clear.style.visibility = "visible";
		const data = await fetchData(value);
		if (data.length === 0) {
			$select.remove();
			return;
		}
		$container.innerHTML = "";
		data.forEach((movie, index) => {
			const $option = document.createElement("div");
			$option.className = "option";
			if (index === 0) $option.classList.add("selected");
			$option.id = movie.id;
			$option.innerText = movie.text;
			$option.dataset.index = index;
			$container.appendChild($option);
		});
		$select.appendChild($container);
		$component.appendChild($select);
	}, 1000);

	$input.addEventListener("input", onChangeInput);
}
