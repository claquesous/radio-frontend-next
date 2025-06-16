'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import debounce from 'debounce'
import { Song } from '../../../_types/types'

interface StreamSearchboxProps {
  streamId: number
}

export default function StreamSearchbox({ streamId }: StreamSearchboxProps) {
  const [options, setOptions] = useState<readonly Song[]>([])
  const [toggle,setToggle] = useState<boolean>(true)
  const [loading, setLoading] = useState(false)
  const previousController = useRef<AbortController | null>(null)
  const router = useRouter()

  const getData = async (searchTerm: string) => {
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

  const onInputChange = (_:any, value:string, reason:string) => {
    if (reason === 'input' && value.length > 0) {
      getData(value)
    } else {
      setOptions([])
    }
  }

  const onChange = (_:any, value: Song | null) => {
    setOptions([])
    if (value) {
      router.push(`/s/${streamId}/songs/${value.id}`)
      setToggle(!toggle)
    }
  }

  return (
    <Autocomplete
      options={options}
      onInputChange={onInputChange}
      onChange={debounce(onChange,1000)}
      loading={loading}
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
