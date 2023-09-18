/**
 *
 * @param { date } - Takes date object and return new Date object in Y-m-d format
 * @returns
 */
export const revertDateObject = (date) => {
    return new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
};

/**
 *
 * @param { date } - Takes date object and date string in Y-m-d format
 * @returns
 */
export const revertDateString = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
