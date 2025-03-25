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
// 使用 SheetJS 解析 Excel 文件
async function convertExcelToArray(file) {
    if (!file) {
        throw new Error("文件不能为空");
    }

    // 动态加载 SheetJS 库
    if (typeof XLSX === "undefined") {
        throw new Error("需要引入 SheetJS 库 (XLSX)");
    }

    // 创建文件读取器
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = function (e) {
            try {
                // 读取文件内容
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // 获取第一个工作表的名称
                const sheetName = workbook.SheetNames[0];

                // 获取第一个工作表内容
                const sheet = workbook.Sheets[sheetName];

                // 将工作表内容转换为二维数组
                const rawArray = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                // 判断数据是否为空
                if (rawArray.length < 2) {
                    throw new Error("Excel 数据不足，至少需要两行数据！");
                }

                // 获取第一行作为键名
                const names = rawArray[0];

                // 从第二行开始作为值
                const values = rawArray.slice(1);

                // 构造键值对数组
                const result = values.map(row => {
                    const entry = {};
                    names.forEach((name, index) => {
                        entry[name] = row[index] !== undefined ? row[index] : null;
                    });
                    return entry;
                });

                resolve(result);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}

/**
 * 根据 label 的文本值找到同级节点中的 input 标签
 * @param {string} labelValue - label 的文本值
 * @returns {HTMLInputElement | null} - 返回对应的 input 标签，如果未找到则返回 null
 */
function getInputByLabel(labelValue) {
    // 查找所有 div 下的 label 标签
    const labelElement = Array.from(document.querySelectorAll('div label')).find(
        label => label.textContent.trim() === labelValue
    );

    if (labelElement) {
        // 获取 label 的同级节点 div
        const siblingDiv = labelElement.parentElement.querySelector('div');

        if (siblingDiv) {
            // 查找同级 div 中的 input 标签
            const inputElement = siblingDiv.querySelector('input');
            if (inputElement) {
                return inputElement; // 返回目标 input 标签
            }
        }
    }

    // 未找到时返回 null
    return null;
}
 /**
 * 根据厂站名称选择对应的 span 标签并触发点击事件
 * @param {string} stationName - 厂站名称
 */
function clickStationSpan(stationName) {
    // 获取目标 ul 元素
    const ulElement = document.querySelectorAll('.el-select-dropdown ul')[1];

    if (!ulElement) {
        console.error('未找到指定的 ul 元素');
        return;
    }

    // 获取 ul 下所有 li 标签的 span 标签
    const spanElements = ulElement.querySelectorAll('li span');

    // 遍历 span 标签，寻找内容为指定厂站名称的 span
    const targetSpan = Array.from(spanElements).find(span => span.textContent.trim() === stationName);

    if (targetSpan) {
        // 触发点击事件
        targetSpan.click();
        console.log(`已触发点击事件，目标厂站名称：${stationName}`);
    } else {
        console.error(`未找到厂站名称为 "${stationName}" 的 span 标签`);
    }
}
/**
 * 设置元素值，并在最后触发回车事件
 * @param {HTMLElement} element - 目标 HTML 元素
 * @param {string} content - 要设置的文本内容
 * @param {number} delayInSeconds - 可选，等待时间（秒）
 */
async function setElementValueWithEnter(element, content, delayInSeconds = 0) {
    if (!element) {
        throw new Error("HTML 元素不能为空");
    }

    // 判断元素类型并设置内容
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

    // 触发回车（Enter）事件
    const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13, // Enter 键的键码
        bubbles: true,
    });
    element.dispatchEvent(enterEvent);
    console.log(`设置值为 "${content}"，并触发回车事件`);
}

/**
 * 获取指定月份的上一个月的字符串
 * @param {string} currentMonth - 当前月份的字符串（格式：YYYY-MM）
 * @returns {string} - 上一个月的字符串（格式：YYYY-MM）
 */
function getPreviousMonth(currentMonth) {
    if (!currentMonth) {
        throw new Error("当前月份不能为空");
    }

    // 将字符串分割为年和月
    const [year, month] = currentMonth.split('-').map(Number);

    // 计算上一个月的日期
    const previousDate = new Date(year, month - 2, 1); // 月份基于零索引（0 = 1月）

    // 格式化为 YYYY-MM 字符串
    const previousYear = previousDate.getFullYear();
    const previousMonth = String(previousDate.getMonth() + 1).padStart(2, '0'); // 月份加 1 并补零
    return `${previousYear}-${previousMonth}`;
}
/**
 * 根据指定的文本查找 span 标签，并返回对应的父级按钮元素
 * @param {string} spanText - span 标签的文本内容
 * @returns {HTMLButtonElement | null} - 返回目标按钮元素，如果未找到则返回 null
 */
function getButtonBySpanText(spanText) {
    // 验证参数
    if (!spanText) {
        throw new Error("spanText 参数不能为空");
    }

    // 查找所有的 span 标签
    const spanElement = Array.from(document.querySelectorAll('span')).find(
        span => span.textContent.trim() === spanText
    );

    if (spanElement) {
        // 获取 span 的父级 button 元素
        const buttonElement = spanElement.closest('button');
        if (buttonElement) {
            return buttonElement; // 返回按钮元素
        } else {
            console.error(`未找到包含 "${spanText}" 的 span 标签对应的父级 button 元素`);
            return null;
        }
    } else {
        console.error(`未找到文本内容为 "${spanText}" 的 span 标签`);
        return null;
    }
}

/**
 * 根据指定的 label 文本值，获取同级 div 标签下的 i 标签
 * @param {string} labelValue - label 的文本值
 * @returns {HTMLElement | null} - 返回目标 i 标签，如果未找到则返回 null
 */
function getIconByLabel(labelValue) {
    // 查找所有 div 下的 label 标签
    const labelElement = Array.from(document.querySelectorAll('div label')).find(
        label => label.textContent.trim() === labelValue
    );

    if (labelElement) {
        // 获取 label 的同级节点 div
        const siblingDiv = labelElement.parentElement.querySelector('div');

        if (siblingDiv) {
            // 查找同级 div 下的 i 标签
            const iconElement = siblingDiv.querySelector('i');
            if (iconElement) {
                return iconElement; // 返回目标 i 标签
            }
        }
    }

    // 未找到时返回 null
    return null;
}

