<template>
  <div id="app">
    <button @click="getBreweriesInCity">양조장 가져오기</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const location = ref<{ latitude: number; longitude: number } | null>(null);

const getBreweriesInCity = async () => {
  const { latitude, longitude } = await getUserLocation();
  const city = await getCityFromCoordinates(latitude, longitude);
  try {
    const response = await axios.get(`https://api.openbrewerydb.org/breweries?by_city=${city}`);
    const data = response.data;
    console.log({ data });
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getCityFromCoordinates = async (latitude: number, longitude: number) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
    const data = response.data;
    if (data && data.address && data.address.city) {
      return data.address.city;  // 도시 이름 반환
    }
  } catch (error) {
    console.error(error);
  }
};

const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          location.value = loc;
          resolve(loc);
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error);
          reject(error);
        }
      );
    } else {
      console.error("이 브라우저는 Geolocation을 지원하지 않습니다.");
      reject(new Error("Geolocation not supported"));
    }
  });
};
</script>

<style>
/* 스타일링. */
</style>
