/**
 * This module validates form input data
 * For example card number should be exactly 16 digits.
 * If any invalid data enters by users, user will be notified onsubmit.
 */
import * as yup from "yup";

/**
 *  Gets yy/MM format and convert it to a Date object
 *  @param  {String} value   value is invalid because yup tries to convert user input to a Date object,
 *  but it cannot (e.g. 22/03 is not a meaningful date).
 *  @param  {String} originalValue  originalValue is the actual value that user enters in text box.
 *  @return {Date}  Properly converted originalValue to Date object.
 **/
function parseDateString(value, originalValue) {
    const parts = originalValue.split("/")
    const mm = parts[0]
    const yy = parts[1]
    //e.g: 22/12 -> 12 01 2022 -> Thu Dec 01 2022 00:00:00
    return new Date(`${mm} 01 20${yy}`)
}

export const validationSchema = yup.object({
        name: yup
            .string("Enter the name")
            .required("Name is required"),
        expirationDate: yup
            .date()
            .required('Expiration date is required')
            // TODO: The following validation does not work yet, check it later
            .test('check expiration date', 'Date format needs to be MM/YY',
                (value, info) => {
                    const originalValue = info.originalValue
                    const isValid = /^\d\d\/\d\d$/.test(originalValue)
                    return isValid
                })
            // .min(new Date('01-01-2019')),
            .min(new Date((new Date()).setDate((new Date()).getDate() + 30)),
                "The expiration date should be 1 month later or more.")
            .transform(parseDateString),
        number: yup
            .number('Enter your Card Number')
            .required('Card Number is required')
            //reference: https://stackoverflow.com/questions/49886881/validation-using-yup-to-check-string-or-number-length
            .test('len', 'Card Number needs to be exactly 16 digits', val => val.toString().length === 16),
        securityCode: yup
            .number('Enter your Security Code')
            .required('Security Code is required')
            .test('len', 'Security Code needs to be exactly 3 digits', val => val.toString().length === 3),
        amountToBePaid: yup
            .number('Enter the amount that you want to be paid')
            .required('Amount is required')
            .min(0.01, 'Amount needs to be more than 0.01')
            .max(999.99, 'Amount needs to be less than 1000.00')
            .test('len fds', 'Amount needs to be a digit with at most two decimal places',
                val => {
                    if (!val) {
                        return false
                    }
                    let parts = val.toString().split(".")

                    // e.g.: 789.
                    // TODO: it doesn't work, ask whether it is important to handle this case or not?
                    if (val.toString().includes(".") && parts.length === 1) {
                        console.log("false")
                        return false
                    }

                    // e.g.: empty input
                    if (parts.length === 0) {
                        return false
                    }

                    // e.g.: 12
                    if (parts.length === 1 && Math.floor(val) === val) {
                        return true
                    }

                    let decimalPart = parts[1]
                    // e.g. 12.09
                    if (decimalPart) {
                        return decimalPart.length <= 2;
                    }
                    return false
                }
            ),
    }
)
