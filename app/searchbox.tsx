'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import debounce from 'debounce'

interface Song {
  id: number
  title: string
}

export default function Searchbar() {
  const [options, setOptions] = useState<readonly Song[]>([])
  const [toggle,setToggle] = useState(true)
  const [loading, setLoading] = useState(false)
  const previousController = useRef()
  const router = useRouter()

  const getData = async (searchTerm) => {
    setLoading(true)
    if (previousController.current) {
      previousController.current.abort()
    }
    const controller = new AbortController()
    const signal = controller.signal
    previousController.current = controller
    const response = await fetch(`/search?query=${searchTerm}&limit=10`)
    const data = await response.json()
    setOptions(data)
    setLoading(false)
  }

  const onInputChange = (event, value, reason) => {
    if (reason === 'input') {
      getData(value)
    } else {
      setOptions([])
    }
  }

  const onChange = (event, value) => {
    setOptions([])
    if (value) {
      router.push(`/songs/${value.id}`)
      setToggle(!toggle)
    }
  }

  return (
    <Autocomplete
      options={options}
      onInputChange={onInputChange}
      onChange={debounce(onChange,1000)}
      loading={loading}
      key={toggle}
      noOptionsText={'Type to search'}
      getOptionLabel={(option) => option ? `${option.artist.name} - ${option.title}` : ''}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Search songs'
          InputProps={{
            ...params.InputProps,
            endAdornment: loading ? <CircularProgress color="inherit" size={20} /> : null,
          }}
        />
      )}
    />
  )
}

