<template>
  <div id="app">
    <select v-model="country">
      <option
        v-for="item in countryOptions"
        :value="item.value"
        :key="item.value"
      >
        {{ item.text }}
      </option>
    </select>
    <button @click="getBreweriesInCountry">
      선택한 국가의 양조장 가져오기
    </button>
    <button @click="getBreweriesInCurrentLocation">
      현재위치에서 가져오기
    </button>
    <!-- 양조장 정보 출력 -->
    <ul>
      <li v-for="brewery in breweries" :key="brewery.id">
        <a :href="brewery.website_url" target="_blank">
          {{ brewery.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { CountryOptions } from './component/Fn/type'
const location = ref<{ latitude: number; longitude: number } | null>(null)
const country = ref<string>('')
const countryOptions = ref(CountryOptions)
const breweries = ref<any[]>([])

const getBreweriesInCountry = async () => {
  try {
    const isValidCountry = countryOptions.value.some(
      (option) => option.value === country.value,
    )
    if (!isValidCountry) {
      alert('유효한 나라를 선택해주세요') // 에러 메시지를 수정
      return
    }
    const response = await axios.get(
      `https://api.openbrewerydb.org/breweries?by_country=${country.value}`,
    )
    const data = response.data
    breweries.value = data
    console.log({ breweries })
  } catch (error) {
    console.error(error)
  }
}

const getBreweriesInCurrentLocation = async () => {
  try {
    await getUserLocation()
    await getCountryFromCoordinates()
    const response = await axios.get(
      `https://api.openbrewerydb.org/breweries?by_country=${country.value}`,
    )
    const data = response.data
    country.value = ''
    breweries.value = data
  } catch (error) {
    console.error(error)
  }
}

const getCountryFromCoordinates = async () => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.value?.latitude}&lon=${location.value?.longitude}&accept-language=en`,
    )
    const data = response.data
    if (data && data.address && data.address.country) {
      country.value = data.address.country
    }
  } catch (error) {
    console.error(error)
  }
}

const getUserLocation = (): Promise<{
  latitude: number
  longitude: number
}> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          location.value = loc
          resolve(loc)
        },
        (error) => {
          console.error('위치 정보를 가져오는데 실패했습니다:', error)
          reject(error)
        },
      )
    } else {
      console.error('이 브라우저는 Geolocation을 지원하지 않습니다.')
      reject(new Error('Geolocation not supported'))
    }
  })
}
</script>

<style>
/*스타일링. */
</style>
