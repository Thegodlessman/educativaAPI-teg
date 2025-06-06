PGDMP  *    4                }            educativaDB    16.4    16.4 A    Q           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            R           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            S           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            T           1262    25015    educativaDB    DATABASE     �   CREATE DATABASE "educativaDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE "educativaDB";
                postgres    false                        3079    25016    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                   false            U           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                        false    2            �            1259    25077 	   countries    TABLE     �   CREATE TABLE public.countries (
    id_country uuid DEFAULT gen_random_uuid() NOT NULL,
    country_name character varying NOT NULL,
    CONSTRAINT countries_country_name_check CHECK ((TRIM(BOTH FROM country_name) <> ''::text))
);
    DROP TABLE public.countries;
       public         heap    postgres    false            �            1259    25128    institutions    TABLE       CREATE TABLE public.institutions (
    id_insti uuid DEFAULT gen_random_uuid() NOT NULL,
    id_location uuid NOT NULL,
    insti_url character varying NOT NULL,
    insti_name character varying NOT NULL,
    insti_descrip character varying NOT NULL,
    CONSTRAINT institutions_insti_descrip_check CHECK ((TRIM(BOTH FROM insti_descrip) <> ''::text)),
    CONSTRAINT institutions_insti_name_check CHECK ((TRIM(BOTH FROM insti_name) <> ''::text)),
    CONSTRAINT institutions_insti_url_check CHECK ((TRIM(BOTH FROM insti_url) <> ''::text))
);
     DROP TABLE public.institutions;
       public         heap    postgres    false            �            1259    25100    municipalities    TABLE     !  CREATE TABLE public.municipalities (
    id_municipality uuid DEFAULT gen_random_uuid() NOT NULL,
    municipality_name character varying NOT NULL,
    id_state uuid NOT NULL,
    CONSTRAINT municipalities_municipality_name_check CHECK ((TRIM(BOTH FROM municipality_name) <> ''::text))
);
 "   DROP TABLE public.municipalities;
       public         heap    postgres    false            �            1259    25114    parishes    TABLE       CREATE TABLE public.parishes (
    id_parish uuid DEFAULT gen_random_uuid() NOT NULL,
    parish_name character varying NOT NULL,
    id_municipality uuid NOT NULL,
    CONSTRAINT parishes_parish_name_check CHECK ((TRIM(BOTH FROM parish_name) <> ''::text))
);
    DROP TABLE public.parishes;
       public         heap    postgres    false            �            1259    25053    roles    TABLE     U  CREATE TABLE public.roles (
    id_rol uuid DEFAULT gen_random_uuid() NOT NULL,
    rol_name character varying NOT NULL,
    rol_descrip character varying NOT NULL,
    CONSTRAINT roles_rol_descrip_check CHECK ((TRIM(BOTH FROM rol_descrip) <> ''::text)),
    CONSTRAINT roles_rol_name_check CHECK ((TRIM(BOTH FROM rol_name) <> ''::text))
);
    DROP TABLE public.roles;
       public         heap    postgres    false            �            1259    25182    roles_users    TABLE     �   CREATE TABLE public.roles_users (
    id_rol_user uuid DEFAULT gen_random_uuid() NOT NULL,
    id_user uuid NOT NULL,
    id_rol uuid NOT NULL
);
    DROP TABLE public.roles_users;
       public         heap    postgres    false            �            1259    25160    room    TABLE       CREATE TABLE public.room (
    id_room uuid DEFAULT gen_random_uuid() NOT NULL,
    code_room character varying(50) NOT NULL,
    secc_room character(10) DEFAULT 'A'::bpchar NOT NULL,
    max_room integer NOT NULL,
    id_institution uuid NOT NULL,
    admin_room uuid NOT NULL,
    create_date date NOT NULL,
    CONSTRAINT room_code_room_check CHECK ((TRIM(BOTH FROM code_room) <> ''::text)),
    CONSTRAINT room_max_room_check CHECK ((max_room > 0)),
    CONSTRAINT room_secc_room_check CHECK ((TRIM(BOTH FROM secc_room) <> ''::text))
);
    DROP TABLE public.room;
       public         heap    postgres    false            �            1259    25086    states    TABLE     �   CREATE TABLE public.states (
    id_state uuid DEFAULT gen_random_uuid() NOT NULL,
    state_name character varying NOT NULL,
    id_country uuid NOT NULL,
    CONSTRAINT states_state_name_check CHECK ((TRIM(BOTH FROM state_name) <> ''::text))
);
    DROP TABLE public.states;
       public         heap    postgres    false            �            1259    25198 	   user_room    TABLE     �   CREATE TABLE public.user_room (
    id_user_room uuid DEFAULT gen_random_uuid() NOT NULL,
    id_user uuid NOT NULL,
    id_room uuid NOT NULL
);
    DROP TABLE public.user_room;
       public         heap    postgres    false            �            1259    25063    users    TABLE     �  CREATE TABLE public.users (
    id_user uuid DEFAULT gen_random_uuid() NOT NULL,
    user_url character varying NOT NULL,
    user_ced character varying NOT NULL,
    user_name character varying NOT NULL,
    user_lastname character varying NOT NULL,
    user_email character varying NOT NULL,
    user_password character varying NOT NULL,
    CONSTRAINT users_user_ced_check CHECK ((TRIM(BOTH FROM user_ced) <> ''::text)),
    CONSTRAINT users_user_email_check CHECK (((TRIM(BOTH FROM user_email) <> ''::text) AND ((user_email)::text ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text))),
    CONSTRAINT users_user_lastname_check CHECK ((TRIM(BOTH FROM user_lastname) <> ''::text)),
    CONSTRAINT users_user_name_check CHECK ((TRIM(BOTH FROM user_name) <> ''::text)),
    CONSTRAINT users_user_password_check CHECK ((TRIM(BOTH FROM user_password) <> ''::text)),
    CONSTRAINT users_user_url_check CHECK ((TRIM(BOTH FROM user_url) <> ''::text))
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    25144    users_institutions    TABLE     �   CREATE TABLE public.users_institutions (
    id_user_institution uuid DEFAULT gen_random_uuid() NOT NULL,
    id_user uuid NOT NULL,
    id_institution uuid NOT NULL
);
 &   DROP TABLE public.users_institutions;
       public         heap    postgres    false            F          0    25077 	   countries 
   TABLE DATA           =   COPY public.countries (id_country, country_name) FROM stdin;
    public          postgres    false    218   �S       J          0    25128    institutions 
   TABLE DATA           c   COPY public.institutions (id_insti, id_location, insti_url, insti_name, insti_descrip) FROM stdin;
    public          postgres    false    222   T       H          0    25100    municipalities 
   TABLE DATA           V   COPY public.municipalities (id_municipality, municipality_name, id_state) FROM stdin;
    public          postgres    false    220   �T       I          0    25114    parishes 
   TABLE DATA           K   COPY public.parishes (id_parish, parish_name, id_municipality) FROM stdin;
    public          postgres    false    221   9U       D          0    25053    roles 
   TABLE DATA           >   COPY public.roles (id_rol, rol_name, rol_descrip) FROM stdin;
    public          postgres    false    216   �U       M          0    25182    roles_users 
   TABLE DATA           C   COPY public.roles_users (id_rol_user, id_user, id_rol) FROM stdin;
    public          postgres    false    225   �V       L          0    25160    room 
   TABLE DATA           p   COPY public.room (id_room, code_room, secc_room, max_room, id_institution, admin_room, create_date) FROM stdin;
    public          postgres    false    224   �V       G          0    25086    states 
   TABLE DATA           B   COPY public.states (id_state, state_name, id_country) FROM stdin;
    public          postgres    false    219   �V       N          0    25198 	   user_room 
   TABLE DATA           C   COPY public.user_room (id_user_room, id_user, id_room) FROM stdin;
    public          postgres    false    226   WW       E          0    25063    users 
   TABLE DATA           q   COPY public.users (id_user, user_url, user_ced, user_name, user_lastname, user_email, user_password) FROM stdin;
    public          postgres    false    217   tW       K          0    25144    users_institutions 
   TABLE DATA           Z   COPY public.users_institutions (id_user_institution, id_user, id_institution) FROM stdin;
    public          postgres    false    223   �W       �           2606    25085    countries countries_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id_country);
 B   ALTER TABLE ONLY public.countries DROP CONSTRAINT countries_pkey;
       public            postgres    false    218            �           2606    25138    institutions institutions_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_pkey PRIMARY KEY (id_insti);
 H   ALTER TABLE ONLY public.institutions DROP CONSTRAINT institutions_pkey;
       public            postgres    false    222            �           2606    25108 "   municipalities municipalities_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public.municipalities
    ADD CONSTRAINT municipalities_pkey PRIMARY KEY (id_municipality);
 L   ALTER TABLE ONLY public.municipalities DROP CONSTRAINT municipalities_pkey;
       public            postgres    false    220            �           2606    25122    parishes parishes_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.parishes
    ADD CONSTRAINT parishes_pkey PRIMARY KEY (id_parish);
 @   ALTER TABLE ONLY public.parishes DROP CONSTRAINT parishes_pkey;
       public            postgres    false    221            �           2606    25062    roles roles_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_rol);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public            postgres    false    216            �           2606    25187    roles_users roles_users_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.roles_users
    ADD CONSTRAINT roles_users_pkey PRIMARY KEY (id_rol_user);
 F   ALTER TABLE ONLY public.roles_users DROP CONSTRAINT roles_users_pkey;
       public            postgres    false    225            �           2606    25169    room room_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (id_room);
 8   ALTER TABLE ONLY public.room DROP CONSTRAINT room_pkey;
       public            postgres    false    224            �           2606    25094    states states_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (id_state);
 <   ALTER TABLE ONLY public.states DROP CONSTRAINT states_pkey;
       public            postgres    false    219            �           2606    25171    room uq_code_room 
   CONSTRAINT     Q   ALTER TABLE ONLY public.room
    ADD CONSTRAINT uq_code_room UNIQUE (code_room);
 ;   ALTER TABLE ONLY public.room DROP CONSTRAINT uq_code_room;
       public            postgres    false    224            �           2606    25203    user_room user_room_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.user_room
    ADD CONSTRAINT user_room_pkey PRIMARY KEY (id_user_room);
 B   ALTER TABLE ONLY public.user_room DROP CONSTRAINT user_room_pkey;
       public            postgres    false    226            �           2606    25149 *   users_institutions users_institutions_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY public.users_institutions
    ADD CONSTRAINT users_institutions_pkey PRIMARY KEY (id_user_institution);
 T   ALTER TABLE ONLY public.users_institutions DROP CONSTRAINT users_institutions_pkey;
       public            postgres    false    223            �           2606    25076    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    217            �           1259    25218    idx_institutions_id_location    INDEX     \   CREATE INDEX idx_institutions_id_location ON public.institutions USING btree (id_location);
 0   DROP INDEX public.idx_institutions_id_location;
       public            postgres    false    222            �           1259    25216    idx_municipalities_id_state    INDEX     Z   CREATE INDEX idx_municipalities_id_state ON public.municipalities USING btree (id_state);
 /   DROP INDEX public.idx_municipalities_id_state;
       public            postgres    false    220            �           1259    25217    idx_parishes_id_municipality    INDEX     \   CREATE INDEX idx_parishes_id_municipality ON public.parishes USING btree (id_municipality);
 0   DROP INDEX public.idx_parishes_id_municipality;
       public            postgres    false    221            �           1259    25224    idx_roles_users_id_rol    INDEX     P   CREATE INDEX idx_roles_users_id_rol ON public.roles_users USING btree (id_rol);
 *   DROP INDEX public.idx_roles_users_id_rol;
       public            postgres    false    225            �           1259    25223    idx_roles_users_id_user    INDEX     R   CREATE INDEX idx_roles_users_id_user ON public.roles_users USING btree (id_user);
 +   DROP INDEX public.idx_roles_users_id_user;
       public            postgres    false    225            �           1259    25222    idx_room_admin_room    INDEX     J   CREATE INDEX idx_room_admin_room ON public.room USING btree (admin_room);
 '   DROP INDEX public.idx_room_admin_room;
       public            postgres    false    224            �           1259    25221    idx_room_id_institution    INDEX     R   CREATE INDEX idx_room_id_institution ON public.room USING btree (id_institution);
 +   DROP INDEX public.idx_room_id_institution;
       public            postgres    false    224            �           1259    25215    idx_states_id_country    INDEX     N   CREATE INDEX idx_states_id_country ON public.states USING btree (id_country);
 )   DROP INDEX public.idx_states_id_country;
       public            postgres    false    219            �           1259    25226    idx_user_room_id_room    INDEX     N   CREATE INDEX idx_user_room_id_room ON public.user_room USING btree (id_room);
 )   DROP INDEX public.idx_user_room_id_room;
       public            postgres    false    226            �           1259    25225    idx_user_room_id_user    INDEX     N   CREATE INDEX idx_user_room_id_user ON public.user_room USING btree (id_user);
 )   DROP INDEX public.idx_user_room_id_user;
       public            postgres    false    226            �           1259    25214    idx_users_email    INDEX     G   CREATE INDEX idx_users_email ON public.users USING btree (user_email);
 #   DROP INDEX public.idx_users_email;
       public            postgres    false    217            �           1259    25220 %   idx_users_institutions_id_institution    INDEX     n   CREATE INDEX idx_users_institutions_id_institution ON public.users_institutions USING btree (id_institution);
 9   DROP INDEX public.idx_users_institutions_id_institution;
       public            postgres    false    223            �           1259    25219    idx_users_institutions_id_user    INDEX     `   CREATE INDEX idx_users_institutions_id_user ON public.users_institutions USING btree (id_user);
 2   DROP INDEX public.idx_users_institutions_id_user;
       public            postgres    false    223            �           2606    25139 "   institutions fk_institution_parish    FK CONSTRAINT     �   ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT fk_institution_parish FOREIGN KEY (id_location) REFERENCES public.parishes(id_parish);
 L   ALTER TABLE ONLY public.institutions DROP CONSTRAINT fk_institution_parish;
       public          postgres    false    4755    222    221            �           2606    25109 $   municipalities fk_municipality_state    FK CONSTRAINT     �   ALTER TABLE ONLY public.municipalities
    ADD CONSTRAINT fk_municipality_state FOREIGN KEY (id_state) REFERENCES public.states(id_state);
 N   ALTER TABLE ONLY public.municipalities DROP CONSTRAINT fk_municipality_state;
       public          postgres    false    4749    220    219            �           2606    25123    parishes fk_parish_municipality    FK CONSTRAINT     �   ALTER TABLE ONLY public.parishes
    ADD CONSTRAINT fk_parish_municipality FOREIGN KEY (id_municipality) REFERENCES public.municipalities(id_municipality);
 I   ALTER TABLE ONLY public.parishes DROP CONSTRAINT fk_parish_municipality;
       public          postgres    false    4752    220    221            �           2606    25177    room fk_room_admin    FK CONSTRAINT     y   ALTER TABLE ONLY public.room
    ADD CONSTRAINT fk_room_admin FOREIGN KEY (admin_room) REFERENCES public.users(id_user);
 <   ALTER TABLE ONLY public.room DROP CONSTRAINT fk_room_admin;
       public          postgres    false    224    4744    217            �           2606    25172    room fk_room_institution    FK CONSTRAINT     �   ALTER TABLE ONLY public.room
    ADD CONSTRAINT fk_room_institution FOREIGN KEY (id_institution) REFERENCES public.institutions(id_insti);
 B   ALTER TABLE ONLY public.room DROP CONSTRAINT fk_room_institution;
       public          postgres    false    222    224    4758            �           2606    25193    roles_users fk_ru_role    FK CONSTRAINT     x   ALTER TABLE ONLY public.roles_users
    ADD CONSTRAINT fk_ru_role FOREIGN KEY (id_rol) REFERENCES public.roles(id_rol);
 @   ALTER TABLE ONLY public.roles_users DROP CONSTRAINT fk_ru_role;
       public          postgres    false    4741    225    216            �           2606    25188    roles_users fk_ru_user    FK CONSTRAINT     z   ALTER TABLE ONLY public.roles_users
    ADD CONSTRAINT fk_ru_user FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 @   ALTER TABLE ONLY public.roles_users DROP CONSTRAINT fk_ru_user;
       public          postgres    false    4744    217    225            �           2606    25095    states fk_state_country    FK CONSTRAINT     �   ALTER TABLE ONLY public.states
    ADD CONSTRAINT fk_state_country FOREIGN KEY (id_country) REFERENCES public.countries(id_country);
 A   ALTER TABLE ONLY public.states DROP CONSTRAINT fk_state_country;
       public          postgres    false    218    4746    219            �           2606    25155 $   users_institutions fk_ui_institution    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_institutions
    ADD CONSTRAINT fk_ui_institution FOREIGN KEY (id_institution) REFERENCES public.institutions(id_insti);
 N   ALTER TABLE ONLY public.users_institutions DROP CONSTRAINT fk_ui_institution;
       public          postgres    false    223    222    4758            �           2606    25150    users_institutions fk_ui_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_institutions
    ADD CONSTRAINT fk_ui_user FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 G   ALTER TABLE ONLY public.users_institutions DROP CONSTRAINT fk_ui_user;
       public          postgres    false    217    223    4744            �           2606    25209    user_room fk_ur_room    FK CONSTRAINT     w   ALTER TABLE ONLY public.user_room
    ADD CONSTRAINT fk_ur_room FOREIGN KEY (id_room) REFERENCES public.room(id_room);
 >   ALTER TABLE ONLY public.user_room DROP CONSTRAINT fk_ur_room;
       public          postgres    false    224    4766    226            �           2606    25204    user_room fk_ur_user    FK CONSTRAINT     x   ALTER TABLE ONLY public.user_room
    ADD CONSTRAINT fk_ur_user FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 >   ALTER TABLE ONLY public.user_room DROP CONSTRAINT fk_ur_user;
       public          postgres    false    226    217    4744            F   <   x�K�L24IM3�57KN�5I32ӵH1O�M�024H�H5N35�K�K�*M�I����� ~/       J   �   x�]�=� �񹜂P��Ѻ''W^x�$J���<�������/ϿW* ����)+��t�@Ih4o}�D%�g@1��am�k����6Du-��l�e��p�K\�1�8�ʽ���~L�SĜ=:Kv�!�%����3Q�w%Οc�3&����sMyDA      H   ]   x����0КL�>9v�,p�5�v"]�/�4�� ��F�*���$\w+C�D�/���q���k��ʙ�7�"���9"��#,�>)�̅M      I   _   x��1� �9�"pe6p���@�J�"�����?ɌR��LY�Q�(�)X�q;���ׯ����囧��i ڝ�Sû��V�)��z���^�      D     x�U�An� E��\�U�ktݍ�f����E{���+�j:������w����aԠ�Y��u��p�.h��ZK�V��Z6I,���^��MM�둪6n��g�8pj%�"��X�J͚��q�v��0|7(���<ۉ5�&�O��C�;����Oh�Š% <h3)@�(Xª����f���S;j��W�I��]:=����&[��­VuD��w����(0x���u8�@ֲܰm�	O�ӷ6��*�'�G���"�^�?(B�,      M      x������ � �      L      x������ � �      G   Q   x��1�  �Y�B*b��tA��I���w�{s!ƶ�a��hi�D����*��>V�\�#�؆=����h�2Ō�"p ���j      N      x������ � �      E      x������ � �      K      x������ � �     