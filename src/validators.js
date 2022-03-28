function min(length) {
  let message = `Minimum length ${length} is required`;

  return (value) => {
    if (value.length > length) {
      return null;
    } else {
      return message;
    }
  };
}

async function verifyEmail(email) {
  if (!email.includes("@")) {
    return "Invalid email address";
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (email.length < 6) {
    return "Not available";
  }
}

function required(value) {
  if (value.length == 0) {
    return "isEmpty";
  }
}

export { min, verifyEmail, required };
