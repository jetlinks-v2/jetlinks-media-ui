import dayjs from "dayjs";

export const timestampFormat = (time: number) => {
    let hour = 0;
    let minute = 0;
    let second = 0;
    const timeStr = 'hh小时mm分钟ss秒';

    if (time) {
        if (time >= 60 * 60 * 1000) {
            hour = Math.trunc(time / (60 * 60 * 1000));
        }

        if (time >= 60 * 1000) {
            minute = Math.trunc((time - hour * 60 * 60 * 1000) / (60 * 1000));
        }

        second = Math.trunc(
            (time - hour * (60 * 60 * 1000) - minute * 60 * 1000) / 1000,
        );
    }

    return timeStr
        .replace('hh', hour.toString())
        .replace('mm', minute.toString())
        .replace('ss', second.toString());
};

/**
 * 把数据下载成JSON
 * @param record
 * @param fileName
 */
export const downloadObject = (record: Record<string, any>, fileName: string, format?: string) => {
    // 创建隐藏的可下载链接
    const ghostLink = document.createElement('a');
    ghostLink.download = `${fileName ? '' : record?.name}${fileName}-${dayjs(new Date()).format(
        format || 'YYYY_MM_DD',
    )}.json`;
    ghostLink.style.display = 'none';
    //字符串内容转成Blob地址
    const blob = new Blob([JSON.stringify(record)]);
    ghostLink.href = URL.createObjectURL(blob);
    //触发点击
    document.body.appendChild(ghostLink);
    ghostLink.click();
    //移除
    document.body.removeChild(ghostLink);
};