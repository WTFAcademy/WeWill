import { format } from 'date-fns';

export const convertUnixTimestamp = function (unixTimestamp:any) {
    const date = new Date(Number(unixTimestamp) * 1000); // 将 UNIX 时间戳转换为毫秒
    const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss'); // 使用 date-fns 格式化日期
    return formattedDate;
}