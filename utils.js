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
