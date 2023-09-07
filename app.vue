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
    <button @click="getBreweriesInCountry">양조장 가져오기</button>
    <!-- 양조장 정보 출력 -->
    <ul>
      <li v-for="brewery in breweries" :key="brewery.id">
        {{ brewery.name }}
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

onMounted(async () => {
  await getUserLocation()
  await getCountryFromCoordinates()
})

const getBreweriesInCountry = async () => {
  try {
    console.log(country.value)
    const response = await axios.get(
      `https://api.openbrewerydb.org/breweries?by_country=${country.value}`,
    )
    const data = response.data
    console.log({ data })
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
      console.log({ data })
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
