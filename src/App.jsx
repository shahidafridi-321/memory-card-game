import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Card } from "./components/Card";
import { ScoreCard } from "./components/ScoreCard";
import { Main } from "./components/Main";
import { Footer } from "./components/Footer";
import { GameStatus } from "./components/WinnerCard.jsx";

export const App = () => {
	const [characters, setCharacters] = useState([]);
	const [picked, setPicked] = useState([]);
	const [bestScore, setBestScore] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [lost, setLost] = useState(false);

	let score = picked.length;

	useEffect(() => {
		async function fetchData() {
			try {
				let response = await fetch(
					"https://pokeapi.co/api/v2/pokemon?limit=12"
				);
				let data = await response.json();
				let results = await data.results;
				let characters = await Promise.all(
					results.map(async (result) => {
						let response = await fetch(result.url);
						let data = await response.json();
						return {
							id: data.id,
							title: data.name,
							image: data.sprites.front_default,
						};
					})
				);
				setCharacters(characters);
				setIsLoading(false);
				setError(false);
			} catch (error) {
				setIsLoading(false);
				setError(true);
				setErrorMessage(`Fetching data Error : ${error}`);
			}
		}
		fetchData();
	}, []);

	function shuffleCharacters() {
		let newArray = [...characters];
		for (let index = characters.length - 1; index > 0; index--) {
			let randomIndex = Math.floor(Math.random() * (index + 1));
			[newArray[index], newArray[randomIndex]] = [
				newArray[randomIndex],
				newArray[index],
			];
		}
		setCharacters(newArray);
	}

	function handleClick(id) {
		if (picked.includes(id)) {
			setPicked([]);
			bestScore < score ? setBestScore(score) : bestScore;
			setLost(true);
		} else {
			setPicked([...picked, id]);
		}
		shuffleCharacters();
	}

	function handlePlayAgain() {
		setPicked([]);
		setBestScore(0);
		if (lost) {
			setLost(false);
		}
	}

	if (isLoading)
		return (
			<div className="w-screen h-screen bg-gray-800 flex justify-center items-center ">
				<Header titleText="Loading..." />
			</div>
		);

	if (isError)
		return (
			<div className="w-screen h-screen bg-gray-800 flex flex-col justify-center items-center ">
				<Header titleText="Error" />
				<h2 className="text-white text-center mt-2 text-sm font-medium">
					Please refresh the page
				</h2>
				<p className="text-white">{errorMessage}</p>
			</div>
		);
	return (
		<>
			<Header titleText="Memory Card Game" />

			<Main>
				{lost ? (
					<div className="h-screen w-screen flex justify-center items-center">
						<GameStatus
							message="You lost"
							handlePlayAgain={handlePlayAgain}
							bestScore={bestScore}
						/>
					</div>
				) : (
					<>
						{score !== characters.length ? (
							<>
								<div className="bg-gray-800 flex justify-end p-2">
									<ScoreCard score={score} />
								</div>

								<div
									className="bg-gray-800 grid grid-cols-3 gap-4 p-4 
									sm:grid-cols-4 
									md:grid-cols-6"
								>
									{characters.map((character) => (
										<Card
											key={character.id}
											image={character.image}
											title={character.title}
											handleClick={handleClick}
											id={character.id}
										/>
									))}
								</div>
							</>
						) : (
							<div className="h-screen w-screen flex justify-center items-center">
								<GameStatus
									handlePlayAgain={handlePlayAgain}
									message="Congratulations You won!"
									bestScore="12"
								/>
							</div>
						)}
					</>
				)}
			</Main>

			<Footer text="A Project Of The Odin Project" />
		</>
	);
};
