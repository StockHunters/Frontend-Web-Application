<script>
import {userService} from "@/auth/services/user.services.js";
import {UserAssembler} from "@/auth/services/user.assembler.js";

export default {
  name: "UserItem",
  props: {
    userId: { type: String, required: true }
  },
  data(){
    return{
      user: ''
    }
  },
  methods: {
    async getUser(){
      let user = await userService.getById(this.userId);
      try {
        this.user = UserAssembler.toUser(user);
      }
      catch(err){
        console.log(err);
      }
    }
  },
  mounted() {
    this.getUser();
  }
}
</script>

<template>
  <div class="user-item">

    <div class="user-image-container" aria-label="image container from user">
      <img
          src="https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
          :aria-label="`image from ` + this.user.username"
          class="user-image" >
    </div>

    <div class="user-content" aria-label="content container from user">

      <p class="user-name"
         :aria-label="`tag name from ` + this.user.firstname"> {{this.user.firstname}} </p>

      <p class="user-role"
         :aria-label="`tag role from ` + this.user.firstname"> {{this.user.role}} </p>
    </div>

  </div>
</template>

<style scoped>

.user-image{
  width: 100%;
  height: 100%;
  border-radius: 100%;
  transition: scale 0.15s ease-in-out;
  cursor: pointer;
}

.user-image:hover{
  scale: 1.1;
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  gap: 10px;
  color: var(--text-color);
  max-width: 120px;
  padding: 15px;
  border-radius: 5px;
}

.user-role{
  background-color: var(--color-blue-500);
  border-radius: 5px;
  margin-top: 10px;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  color: var(--text-white);
}

.user-content{
  display: flex;
  align-items: center;
  flex-direction: column;
}

</style>