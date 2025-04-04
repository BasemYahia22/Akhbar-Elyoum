const StatusMessage = ({ loading, error }) => {
  const divStyle =
    "fixed inset-0 flex items-center justify-center w-full lg:ml-[150px]";
  const pStyle = "text-2xl";
  if (loading) {
    return (
      <div className={divStyle}>
        <p className={pStyle}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={divStyle}>
        <p className={pStyle}>{error}</p>
      </div>
    );
  }

  return null;
};
export default StatusMessage;
