import { useEffect } from "react";
import StudentTable from "../../components/StudentTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentGrades } from "../../redux/slices/fetchStudentGradesSlice";
import StatusMessage from "../../components/StatusMessage";

const ShowStudentGrades = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.fetchStudentGrades
  );
  const { role } = useSelector((state) => state.auth);
  // Fetch student grades data on component mount
  useEffect(() => {
    if (!data) {
      dispatch(fetchStudentGrades(role));
    }
  }, [dispatch, data]);
 if (loading || error) {
   return <StatusMessage loading={loading} error={error} />;
 }
  return (
    <div>
      <StudentTable data={data} />
    </div>
  );
};

export default ShowStudentGrades;
