import type { Participant } from "../services/api/clients/participantsClient";

export function validateRow(
  row: Participant,
  existingEmails: string[],
  existingPhones: string[]
) {
  const errorMsgs: Partial<Record<keyof Participant, string>> = {};

  if (!row.name) errorMsgs.name = "Name can't be empty";
  else if (row.name.length < 6)
    errorMsgs.name = "Name can't be less than 6 characters";

  if (!row.fatherName) errorMsgs.fatherName = "Father Name can't be empty";
  else if (row.fatherName.length < 6)
    errorMsgs.fatherName = "Father Name can't be less than 6 characters";

  if (!row.school) errorMsgs.school = "School can't be empty";
  else if (row.school.length < 6) errorMsgs.school = "School name too short";

  if (!row.homeTown) errorMsgs.homeTown = "Hometown can't be empty";
  else if (row.homeTown.length < 3)
    errorMsgs.homeTown = "Hometown name too short";

  if (row.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(row.email)) errorMsgs.email = "Invalid email format";
    else if (
      existingEmails.includes(row.email.toLowerCase()) &&
      row.type === "individual"
    )
      errorMsgs.email = "Email already in use";
  } else errorMsgs.email = "Email can't be empty";

  if (row.phone) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(row.phone)) errorMsgs.phone = "Invalid phone number";
    else if (existingPhones.includes(row.phone) && row.type === "individual")
      errorMsgs.phone = "Phone already in use";
  } else errorMsgs.phone = "Phone can't be empty";

  const classNum = parseInt(row.class as any);
  if (isNaN(classNum)) errorMsgs.class = "Class must be a number";
  else if (classNum < 5 || classNum > 10)
    errorMsgs.class = "Class not allowed (5–10 only)";

  if (!row.dob) errorMsgs.dob = "DOB can't be empty";
  else {
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(row.dob);
    if (!validDate) errorMsgs.dob = "Invalid date format (yyyy-mm-dd)";
    else {
      const year = parseInt(row.dob.split("-")[0]);
      if (year < 2005 || year > 2015)
        errorMsgs.dob = "Birth year must be between 2005–2015";
    }
  }

  const validTypes = ["individual", "school"];
  if (!validTypes.includes(row.type?.toLowerCase()))
    errorMsgs.type = "Invalid type";

  const isValid = Object.keys(errorMsgs).length === 0;
  return { isValid, errorMsgs };
}
