<template>
  <validation-observer
      v-if="newPark"
      v-slot="{ handleSubmit }"
  >
    <header class="is-relative">
      <ParkCarousel :photos="newPark.photos" />
      <div
          class="py-2"
          style="background-color: rgba(255, 255, 255, 0.75); position: absolute; bottom: 0; left: 0; right: 0;"
      >
        <p class="has-text-weight-bold has-text-centered is-size-5">{{ newPark.name || 'New park' }}</p>
      </div>
    </header>
    <form>
      <BInputWithValidator
          v-model="newPark.name"
          horizontal
          label="Name"
      />
      <BField
          class="mb-4"
          horizontal
          label="Location"
      >
        <div>
          <MapComponent
              :address.sync="newPark.address"
              :geo-location.sync="newPark.geoLocation"
              :is-editing="editing"
              style="width: 100%; min-height: 400px;"
          />
        </div>
      </BField>
      <BField
          horizontal
          label="Photos"
      >
        <BUpload
            accept=".jpg,.jpeg,.png"
            drag-drop
            expanded
            multiple
            native
            @input="$emit('upload-images', $event)"
        >
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon
                    icon="upload"
                    size="is-large"
                >
                </b-icon>
              </p>
              <p>Drop your files here or click to upload</p>
            </div>
          </section>
        </BUpload>
      </BField>
      <div v-if="uploads.length">
        <p class="is-size-7">Uploading</p>
        <ul class="is-flex is-flex-wrap-wrap">
          <li
              v-for="upload in uploads"
              :key="upload.name"

          >
            <div class="box p-2 m-2">
              <ParkFormImage
                  :upload="upload"
                  @delete="$emit('delete-upload', upload)"
              />
            </div>
          </li>
        </ul>
      </div>
      <BField
          v-if="newPark.photos.length"
          horizontal
          label="Uploaded"
      >
        <ul class="is-flex is-flex-wrap-wrap">
          <li
              v-for="photo in newPark.photos"
              :key="photo.name"
          >
            <div
                class="p-2 mr-2 mb-2 has-background-white"
                style="border: 1px solid #efefef; border-radius: 4px;"
            >
              <ParkFormImage
                  :upload="photo"
                  @delete="$emit('delete-upload', photo)"
              />
            </div>
          </li>
        </ul>
      </BField>
      <div class="mb-4">
        <BField
            horizontal
            label="Description"
        >
          <BInput
              v-model="newPark.description"
              maxlength="250"
              placeholder
              type="textarea"
          ></BInput>
        </BField>
      </div>
      <footer class="is-flex is-justify-content-space-between">
        <div class="buttons">
          <BButton
              v-if="!submitted || $store.state.USER.roles && $store.state.USER.roles.admin"
              :disabled="loading"
              :loading="loading"
              outlined
              type="is-primary"
              @click="handleSubmit(() => $emit('save', true))"
          >
            <strong>
              Save and continue later
            </strong>
          </BButton>
          <ButtonWithDropdown
              v-if="!submitted || $store.state.USER.roles && $store.state.USER.roles.admin"
              :disabled="loading"
              :loading="loading"
              outlined
              position="is-top-left"
              type="is-danger"
              @click="handleCancel"
          >
            <strong>
              Cancel
            </strong>
            <template #dropdown>
              <BDropdownItem @click="$emit('delete')">
                <BIcon
                    class="mr-2"
                    icon="trash-alt"
                />
                <strong>Delete</strong>
              </BDropdownItem>
            </template>
          </ButtonWithDropdown>
        </div>
        <BButton
            v-if="!submitted"
            :disabled="loading"
            :loading="loading"
            type="is-primary"
            @click="handleSubmit(() => $emit('submit'))"
        >
          <strong>
            Submit for review
          </strong>
        </BButton>
      </footer>
    </form>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import BInputWithValidator from '@/components/inputs/BInputWithValidator.vue';
import MapComponent from '@/components/park-editor/MapComponent.vue';
import {ValidationObserver} from 'vee-validate';
import {Park, ParkPhotoUpload, PathNames} from '@/types';
import ParkFormImage from '@/components/park/ParkFormImage.vue';
import ParkFormName from '@/components/park/park-form/ParkFormName.vue';
import ParkCarousel from '@/components/park/ParkCarousel.vue';
import ButtonWithDropdown from '@/components/utility/ButtonWithDropdown.vue';

@Component({
  components: {
    ButtonWithDropdown,
    ParkCarousel,
    ParkFormName, ParkFormImage, ParkForm, MapComponent, BInputWithValidator, ValidationObserver,
  },
})
export default class ParkForm extends Vue {
  @Prop(Boolean) private readonly loading!: boolean;
  @Prop(Array) private readonly uploads!: ParkPhotoUpload[];
  @Prop(Object) private readonly value!: Park;
  @Prop(Boolean) private readonly editing!: boolean;
  @Prop(Boolean) private readonly submitted!: boolean;

  private newPark: Park = this.value;

  @Watch('value', {immediate: true, deep: true})
  onParkChanged(val: Park) {
    this.newPark = val;
  }

  @Watch('newPark', {deep: true})
  onNewParkChanged(val: Park) {
    this.$emit('input', val);
  }

  public handleCancel() {
    if (window.history.length) {
      this.$router.back();
    } else {
      this.$router.push({name: PathNames.MyParks});
    }
  }
}
</script>
