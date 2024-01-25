/**
 * Represents a consumer.
 */
export class DateTrimmer {
  /**
   * Trims an array containing lits.
   *
   * @param {object[]} rawLits - the lits to configure.
   * @returns {object[]} ltts
   */
  trimLits (rawLits) {
    const lits = rawLits.map(lit => {
      const newTime = this.#trim(lit.createdAt)
      lit.createdAt = `${newTime.date} ${newTime.time}`
      return lit
    })
    return lits
  }

  /**
   * Trims the date.
   *
   * @param {string} dateString - the date to trim '2024-01-09T17:05:11.528Z'
   * @returns {object} trimmed date.
   */
  #trim (dateString) {
    const [rawDate, time] = dateString.split('T')

    const timeShort = time.split('.')[0]

    return {
      date: rawDate,
      time: timeShort
    }
  }
}
