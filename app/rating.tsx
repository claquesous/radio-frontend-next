'use client'
import ReactSpeedometer from 'react-d3-speedometer'

export default function Rating(props: { rating: integer } ) {
  const { rating } = props

  return <ReactSpeedometer 
    value={rating}
    maxValue={100}
    startColor='blue'
    endColor='red'
    segments={200}
    ringWidth={30}
    maxSegmentLabels={0}
    currentValueText={''}
    needleColor='grey'
    needleHeightRatio={0.75}
    svgAriaLabel={`Rating of ${rating}`}
  />
}

