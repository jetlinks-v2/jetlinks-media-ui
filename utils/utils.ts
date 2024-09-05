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