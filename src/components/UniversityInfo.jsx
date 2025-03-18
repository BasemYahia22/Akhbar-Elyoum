const UniversityInfo = () => {
  const containerStyle =
    "max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-md mt-5";
  const aboutH2Style = "mb-2 text-xl text-gray-800 font-crimson-text-bold";
  const aboutTextStyle = "text-[16px] text-gray-500 font-crimson-text-regular";
  const buttonStyle =
    "py-2 text-lg transition text-primary font-crimson-text-bold";
  return (
    <div className={containerStyle}>
      {/* About University Section */}
      <div className="mb-8">
        <h2 className={aboutH2Style}>About University</h2>
        <p className={aboutTextStyle}>
          Sorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <button className={buttonStyle}>See More</button>
      </div>

      {/* About Credit Hours Section */}
      <div>
        <h2 className={aboutH2Style}>About Credit Hours</h2>
        <p className={aboutTextStyle}>
          Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum.
        </p>
        <button className={buttonStyle}>See More</button>
      </div>
    </div>
  );
};

export default UniversityInfo;
