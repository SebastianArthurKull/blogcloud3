export default function Searchbar({query, itemCount, onChange}) {
    return (<>
        <input onChange={onChange} value={query} placeholder="Search..."></input>
        <>{itemCount}</>
    </>)
}
