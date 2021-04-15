<template>
  <BSidebar
      fullheight
      mobile="reduce"
      open
      position="static"
      type="is-white"
  >
    <BMenu class="p-4">
      <BMenuList label="Menu">
        <BMenuItem
            v-for="item in menuItems"
            :key="item.label"
            :icon="item.icon"
            :to="item.to"
            tag="router-link"
        >
          <template #label>
            <span class="is-hidden-mobile">{{ item.label }}</span>
          </template>
        </BMenuItem>
      </BMenuList>
    </BMenu>
  </BSidebar>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {PathNames} from '@/types';

type MenuItem = {
  label: string,
  icon: string,
  to: { name: PathNames } | string
}

@Component
export default class MainMenu extends Vue {
  private readonly menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'home',
      to: {
        name: PathNames.Home,
      },
    },
    {
      label: 'Events',
      icon: 'calendar',
      to: {
        name: PathNames.Home,
      },
    },
    {
      label: 'Friends',
      icon: 'user-friends',
      to: {
        name: PathNames.Home,
      },
    },
    {
      label: 'Groups',
      icon: 'users',
      to: {
        name: PathNames.Home,
      },
    },
    {
      label: 'My parks',
      icon: 'leaf',
      to: {
        name: PathNames.MyParks,
      },
    },
  ];
}
</script>

<style scoped>

</style>
