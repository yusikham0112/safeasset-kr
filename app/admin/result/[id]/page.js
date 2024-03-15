import Result from "./result";
import "./result.css";

export default function result(props) {
  props.params.id;
  return (
    <>
      <Result id={props.params.id} />
    </>
  );
}
