<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img style="cursor: pointer;" @click="goToMainPage" class="mx-auto h-10 w-auto" src="/src/assets/image.png"
                alt="XLLAMA" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
                Submit Your Product
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
            <form class="space-y-6" @submit.prevent="handleSubmit">
                <!-- Product Name -->
                <div>
                    <label for="name" class="block text-sm/6 font-bold text-white">Product Name</label>
                    <div class="mt-2">
                        <input id="name" v-model="product.name" name="name" type="text" autocomplete="off" required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <!-- Version -->
                <div>
                    <label for="version" class="block text-sm/6 font-bold text-white">Version</label>
                    <div class="mt-2">
                        <input id="version" v-model="product.version" name="version" type="text" autocomplete="off"
                            required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <!-- Description -->
                <div>
                    <label for="description" class="block text-sm/6 font-bold text-white">Description</label>
                    <div class="mt-2">
                        <textarea id="description" v-model="product.description" name="description" rows="5"
                            placeholder="Provide a detailed description of the product." required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"></textarea>
                    </div>
                </div>

                <!-- Highlights -->
                <div>
                    <label for="highlights" class="block text-sm/6 font-bold text-white">Highlights</label>
                    <div class="mt-2">
                        <textarea id="highlights" v-model="product.highlights" name="highlights" rows="3"
                            placeholder="Enter highlights separated by semicolons (e.g., Feature 1; Feature 2; Feature 3)"
                            required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"></textarea>
                    </div>
                </div>

                <!-- Upload Avatar -->
                <div>
                    <label class="block text-sm/6 font-bold text-white">Upload Avatar</label>
                    <div class="mt-2">
                        <p v-if="selectedAvatarFile" class="mb-2 text-sm text-white">Selected: {{ selectedAvatarFile
                            }}
                        </p>
                        <label for="avatar"
                            class="cursor-pointer rounded-md bg-indigo-600 py-1 px-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            style="width: 150px; display: inline-block;">
                            Choose File
                        </label>
                        <input id="avatar" name="avatar" ref="avatarFile" type="file" accept="image/*" class="hidden"
                            @change="handleAvatarFileChange" />
                    </div>
                </div>

                <!-- Upload Bot File -->
                <div>
                    <label class="block text-sm/6 font-bold text-white">Enter the URL of your model.zip</label>
                    <div class="mt-2">
                        <input 
                            v-model="botFileURL" 
                            id="botFileURL" 
                            name="botFileURL" 
                            type="text" 
                            placeholder="Enter .zip file URL" 
                            required
                            autocomplete="off"
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"
                            >
                    </div>
                </div>

                <!-- Submit Button -->
                <div>
                    <button type="submit"
                            :class="{
                                'flex w-full mx-auto justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2': true,
                                'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-500': !isSubmitting,
                                'bg-gray-300 text-black cursor-not-allowed': isSubmitting
                                 }"
                            :disabled="isSubmitting"> 
                        <span v-if="isSubmitting" class="absolute ml-40 w-5 h-5 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></span>
                        {{ isSubmitting ? 'Submmitting' : 'Submit' }}
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    computed: {
        User() {
            return this.$store.state.user;
        },
    },
    data() {
        return {
            product: {
                name: '',
                version: '',
                highlights: '',
                description: '',
            },
            selectedAvatarFile: '', // 存储头像文件名称
            botFileURL: '', // 存储 bot 文件名称
            isSubmitting: false, // 是否正在提交
        };
    },
    methods: {
        handleAvatarFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedAvatarFile = file.name; // 更新头像文件名称
            } else {
                this.selectedAvatarFile = ''; // 清空文件名
            }
        },

        
        goToMainPage() {
            this.$router.push('/Home'); // 跳转到主页
        },
        handleSubmit() {
            this.isSubmitting = true; // 设置正在提交状态

            // 校验 Version 格式
            const versionPattern = /^\d+\.\d+(\.\d+)?$/; // 匹配 x.x 或 x.x.x 格式
            if (!versionPattern.test(this.product.version)) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  confirmButtonText: 'OK',
                  text: 'Version must be in the format x.x (e.g., 1.0)',
                })
                return;
            }

            // 校验 Highlights
            if (!this.product.highlights.trim()) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  confirmButtonText: 'OK',
                  text: 'Highlights are required.',
                })
                return;
            }

            // 将 Highlights 字符串分割为数组
            const highlightsArray = this.product.highlights
                .split(';') // 按分号分割
                .map(item => item.trim()) // 去掉每个条目的前后空格
                .filter(item => item); // 移除空字符串

            if (highlightsArray.length === 0) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  confirmButtonText: 'OK',
                  text: 'Highlights must include at least one valid item.',
                })
                return;
            }


            // 校验 Description
            if (!this.product.description.trim()) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  confirmButtonText: 'OK',
                  text: 'Description is required.',
                })
                return;
            }

            // 校验上传文件
            const avatarFile = this.$refs.avatarFile.files[0];

            console.log('Avatar file:', avatarFile);
            if (!avatarFile) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  confirmButtonText: 'OK',
                  text: 'Avatar file is required.',
                })
                return;
            }

            if (!this.botFileURL) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  confirmButtonText: 'OK',
                  text: 'Bot file URL is required.',
                })
                return;
            }

            // 校验头像文件类型（必须是图片）
            const avatarFileType = avatarFile.type;
            if (!avatarFileType.startsWith('image/')) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  confirmButtonText: 'OK',
                  text: 'Avatar file must be an image (e.g., .jpg, .png).',
                })
                return;
            }

            // 提交数据
            console.log('Submitted data:', {
                ...this.product,
                avatarFile,
                botFileURL,
            });

            const productDetails = {
                name: this.product.name,
                version: this.product.version,
                highlight: this.product.highlights,
                description: this.product.description,
                createdBy: this.User.email,
            };


            const formData = new FormData();
            formData.append('productDetails', JSON.stringify(productDetails));
            formData.append('avatarFile', this.$refs.avatarFile.files[0]);
            formData.append('botFile', this.botFileURL);

            axios.post('/bots/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                this.isSubmitting = false; // 设置提交状态为 false
                Swal.fire({
                    title: 'Success!',
                    html: `<p style="font-family: poppins;">Your bot has been upload successfully.<br>Waiting for Admin review.</p>`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,  
                    allowEscapeKey: false
                }).then((result) => {
                    if(result.isConfirmed)
                        this.goToMainPage();
                });
                console.log('Server response:', response.data);
            }).catch(error => {
                this.isSubmitting = false; // 设置提交状态为 false
                Swal.fire({
                    title: 'Error!',
                    html: `<p style="font-family: poppins;">Something wrong when uploading!</p>`,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,  
                    allowEscapeKey: false
                })
                console.error('An error occurred:', error);
            });
        },
    },
};
</script>
