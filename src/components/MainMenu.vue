<template>
  <BSidebar
      fullheight
      mobile="reduce"
      open
      position="static"
      type="is-lighter"
  >
    <BMenu>
      <BMenuList>
        <template #label>
          <div class="menu-label p-3 is-size-7">Menu</div>
        </template>
        <BMenuItem
            v-for="item in menuItems"
            :key="item.label"
            :icon="item.icon"
            :to="item.to"
            tag="router-link"
            exact-active-class="has-background-primary has-text-white"
        >
          <template #label>
            <span class="is-hidden-mobile px-2">{{ item.label }}</span>
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
        name: PathNames.Events,
      },
    },
    {
      label: 'Friends',
      icon: 'user-friends',
      to: {
        name: PathNames.Friends,
      },
    },
    {
      label: 'Groups',
      icon: 'users',
      to: {
        name: PathNames.Groups,
      },
    },
    {
      label: 'My parks',
      icon: 'leaf',
      to: {
        name: PathNames.MyParks,
      },
    },
    {
      label: 'Settings',
      icon: 'cog',
      to: {
        name: PathNames.Settings,
      },
    },
    {
      label: 'Messages',
      icon: 'comment',
      to: {
        name: PathNames.Messages
      },
    },
  ];
}
</script>

<style scoped>

</style>
