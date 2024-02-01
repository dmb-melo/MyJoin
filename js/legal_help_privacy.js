async function legalHelpPrivacyinit() {
  await includeHTML();
  loadUserData();
  setInitialsInTheHeader();
}

function closelegalHelpPrivacyContent() {
  if (legalInformationLogin === true || legalInformationSignup === true) {
    closelegalInformationLoginPage();
  } else {
    window.location.href = "./summary.html";
    document.getElementById("helpIcon").classList.remove("d-none");
  }
}

function closelegalInformationLoginPage() {
  if (legalInformationLogin === true) {
    renderLogInContent();
    legalInformationLogin = false;
  } else {
    renderSignUpContent();
    legalInformationSignup = false;
  }
  document.getElementById("signUpButtonHeadline").classList.remove("d-none");
  document.getElementById("loginpageDataProtectionContainer").classList.remove("d-none");
  document.getElementById("animationJoinLogoContainer").classList.remove("d-none");
  document.getElementById("joinLogoContainer").classList.remove("d-none");
}
