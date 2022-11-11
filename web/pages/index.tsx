interface HomeProps {
  count: number;
}

export default function Home(props: HomeProps) {
  return (
    <h1>Contagem: {props.count}</h1>
  )
}

export const getServerSideProps = async () => {
  const responde = await fetch('http://localhost:3001/pools/count');
  const data = await responde.json();

  return {
    props: {
      count: data.count
    }
  }
}