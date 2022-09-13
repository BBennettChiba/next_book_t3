import zxcvbn from "zxcvbn";
export default function PasswordStrengthMeter({ password }: { password: any }) {
  const evaluation = zxcvbn(password);
  function changeProgressBar() {
    const backgroundColor = {
      0: "red",
      1: "orangeRed",
      2: "orange",
      3: "yellow",
      4: "green",
    };
    return {
      width: password === "" ? "0" : `${((evaluation.score + 1) * 100) / 5}%`,
      backgroundColor: backgroundColor[evaluation.score],
    };
  }
  return (
    <div className='bg-slate-300 w-full h-5'>
      <div className='h-full duration-300' style={changeProgressBar()}></div>
      <div className="feedback">
        <div className="warning">{evaluation.feedback.warning}</div>
        {evaluation.feedback.suggestions.map((suggestion, i) => (
          <div key={i} className="suggestions">
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
}
