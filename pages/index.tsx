import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ArrowDown from "../icons/ArrowDown"
import Search from "../icons/Search"
import ClickAwayListener from "react-click-away-listener"
import CountryCard from "../components/CountryCard"
import { Country } from "../types/Country"
import SkeletonCard from "../components/SkeletonCard"

const Home: NextPage<{ countries: Country[] }> = ({ countries }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOption, setFilteredOption] = useState("")
  const [showFilterOption, setShowFilterOption] = useState(false)
  const [loading, setLoading] = useState(true)

  const region: string[] = [
    "all",
    "africa",
    "americas",
    "asia",
    "europe",
    "oceania",
  ]

  const filteredCountries =
    filteredOption === ""
      ? countries
      : countries.filter(
          (country) => country.region.toLowerCase() === filteredOption
        )

  const searchedCountries =
    searchQuery === ""
      ? filteredCountries
      : filteredCountries.filter((country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase())
        )

  const cardList = searchedCountries.map((country) => {
    return (
      <div key={country.alpha3Code + country.name}>
        <CountryCard data={country} />
      </div>
    )
  })

  const handleFilterByRegion = (region: string) => {
    if (region === "all") {
      setFilteredOption("")
    } else {
      setFilteredOption(region)
    }
    closeFilterMenu()
  }
  const closeFilterMenu = () => setShowFilterOption(false)

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value)
  }

  const timer = () => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  useEffect(() => {
    if (countries) {
      timer()
    }
  }, [countries])

  let skeletoncards = Array(countries.length).fill(0)
  return (
    <>
      <Head>
        <title>Know Your Country</title>
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Know Your Country" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="px-5 md:px-7 lg:px-6 xl:px-14 font-nunito">
        <section className="flex md:items-start flex-col space-y-10 md:space-y-0 md:flex-row md:justify-between mb-10">
          {/* input */}
          <div className="input h-16 w-full md:w-96 lg:w-[480px] shadow-md cursor-pointer relative">
            <input
              type="text"
              className="w-full h-full bg-light_Mode_Elements dark:bg-dark_Mode_Elements cursor-pointer pr-10 pl-20 outline-none text-sm text-light_Mode_Text dark:text-dark_Mode_Text rounded-md"
              placeholder="Search for a country..."
              value={searchQuery}
              onChange={handleSearchInput}
            />
            <span className="block absolute top-1/2 -translate-y-1/2 left-10 h-7 w-7">
              <Search />
            </span>
          </div>
          {/* filter */}
          <ClickAwayListener onClickAway={closeFilterMenu}>
            <div className="w-[15.625rem] lg:w-[12.5rem] space-y-2 cursor-pointer relative z-20">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-light_Mode_Elements dark:bg-dark_Mode_Elements w-full h-16 flex items-center justify-between px-7 shadow-md rounded-md"
                onClick={() => setShowFilterOption(!showFilterOption)}
              >
                <p className="text-base font-semibold select-none capitalize">
                  {filteredOption === "" ? "filter by region" : filteredOption}
                </p>
                <ArrowDown />
              </motion.div>

              {showFilterOption && (
                <motion.div
                  className="w-full absolute top-[4.5rem] px-7 py-5 bg-light_Mode_Elements dark:bg-dark_Mode_Elements flex flex-col shadow-md rounded-md"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.15 },
                  }}
                  exit={{ opacity: 0}}
                >
                  {region.map((reg) => (
                    <li
                      key={reg}
                      className="list-none capitalize block text-light_Mode_Text dark:text-dark_Mode_Text text-lg font-light dark:hover:text-dark_Mode_Text/50 hover:text-light_Mode_Text/50 duration-300"
                      onClick={() => handleFilterByRegion(reg)}
                    >
                      {reg}
                    </li>
                  ))}
                </motion.div>
              )}
            </div>
          </ClickAwayListener>
        </section>

        {loading ? (
          <section className="country-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 md:gap-14 lg:gap-16 xl:gap-[4.6875rem] place-items-center lg:place-items-start">
            {" "}
            {skeletoncards.map((index: number) => (
              <SkeletonCard key={index} />
            ))}
          </section>
        ) : (
          <section className="country-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 md:gap-14 lg:gap-16 xl:gap-[4.6875rem] place-items-center lg:place-items-start">
            {cardList}
          </section>
        )}
      </div>
    </>
  )
}

export default Home

const BASE_URL = "https://restcountries.com/v2/all"

export const getStaticProps = async () => {
  const res = await fetch(
    `${BASE_URL}?fields=alpha3Code,name,flags,population,region,capital`
  )
  const data = await res.json()

  return {
    props: {
      countries: data,
    },
  }
}
