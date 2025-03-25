// 异步函数，设置元素值或文本内容
async function setElementValue(element, content, delayInSeconds = 0) {
    if (!element) {
        throw new Error("HTML元素不能为空");
    }

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value = content;
    } else {
        element.innerHTML = content;
    }

    // 触发输入事件
    const inputEvent = new Event('input');
    element.dispatchEvent(inputEvent);

    // 判断是否需要等待
    if (delayInSeconds > 0) {
        await new Promise(resolve => setTimeout(resolve, delayInSeconds * 1000));
    }
}

// 异步函数，执行点击事件
async function clickElement(element, delayInSeconds = 0) {
    if (!element) {
        throw new Error("HTML元素不能为空");
    }

    // 触发点击事件
    const clickEvent = new Event('click');
    element.dispatchEvent(clickEvent);

    // 判断是否需要等待
    if (delayInSeconds > 0) {
        await new Promise(resolve => setTimeout(resolve, delayInSeconds * 1000));
    }
}
