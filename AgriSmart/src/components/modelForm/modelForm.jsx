export default function ModelForm(props) {

    const { currTab,showDetail } = props;
    const list = currTab.requirements.split('\n');

    console.log(showDetail);

    return (
        <>
            <h1>{currTab.title}</h1>
            <p>Things required:</p>
            <ol>
                {list.map((item,index) => (
                    <li key={index}>{item}</li>
                ))}
            </ol>
        </>     
    );

};