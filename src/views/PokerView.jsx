import FuncList from "../components/FuncList/funcList.jsx";


function PokerView() {
    const data = JSON.parse(
        sessionStorage.getItem('formData') || '{}'
    );
    return (
        <>
            <FuncList backlog={data}/>
        </>
    );
}

export default PokerView;
